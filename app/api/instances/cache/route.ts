// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { InstanceFetcher } from "../../util";
import { revalidateTag, revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

// Helper function to validate and fix thumbnail paths
async function validateThumbnailPath(thumbnailPath: string): Promise<string> {
  if (!thumbnailPath || thumbnailPath === '') {
    return '/img/fedi_placeholder.png';
  }
  
  // If it's already a runaway path (multiple /img/), fix it
  if (thumbnailPath.includes('/img/img/')) {
    console.log(`Fixing runaway thumbnail path: ${thumbnailPath}`);
    return '/img/fedi_placeholder.png';
  }
  
  // If it's a local path, check if file exists
  if (thumbnailPath.startsWith('/img/')) {
    try {
      const relativePath = thumbnailPath.startsWith('/') ? thumbnailPath.slice(1) : thumbnailPath;
      const fullPath = path.resolve(process.cwd(), 'public', relativePath);
      
      if (fs.existsSync(fullPath)) {
        return thumbnailPath; // File exists, return as is
      } else {
        console.log(`Cached thumbnail not found: ${thumbnailPath}, using fallback`);
        return '/img/fedi_placeholder.png';
      }
    } catch (err) {
      console.error("Error validating cached thumbnail:", err);
      return '/img/fedi_placeholder.png';
    }
  }
  
  return thumbnailPath; // Return as is if it's a remote URL or valid path
}

export async function GET(request: NextRequest) {
  const allInstances = await prisma.instances.findMany({
    where: { banned: false },
  });
  for (let i = 0; i < allInstances.length; i++) {
    try {
      const updateInstance = await InstanceFetcher.checkAvailable(
        allInstances[i].uri,
        allInstances[i].api_mode
      );
      // Fix issues when the cachedata thumbnail is null
      if (updateInstance !== false && updateInstance.thumbnail == null) {
        updateInstance.thumbnail = "/img/fedi_placeholder.png";
      }
      if (updateInstance != false) {
        // Validate and fix the thumbnail path before saving
        const validatedThumbnail = await validateThumbnailPath(updateInstance.thumbnail);
        
        await prisma.instanceData.update({
          where: { instance_id: allInstances[i].id },
          data: {
            title: updateInstance.title,
            description: updateInstance.description,
            thumbnail: validatedThumbnail,
            user_count: updateInstance.user_count,
            status_count: updateInstance.status_count,
            registrations: updateInstance.registrations,
            approval_required: updateInstance.approval_required,
          },
        });
        await prisma.instances.update({
          where: { id: allInstances[i].id },
          data: {
            failed_checks: 0,
          },
        });
      } else {
        if (allInstances[i].failed_checks >= 5) {
          await prisma.instances.update({
            where: { id: allInstances[i].id },
            data: {
              banned: true,
              ban_reason: "Instance failed 5 checks in a row",
            },
          });
        } else {
          await prisma.instances.update({
            where: { id: allInstances[i].id },
            data: {
              failed_checks: allInstances[i].failed_checks + 1,
            },
          });
        }
      }
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        return NextResponse.json({ message: err.message }, { status: 400 });
      } else if (err instanceof PrismaClientValidationError) {
        return NextResponse.json({ message: err.message }, { status: 400 });
      }
    }
  }
  
  // Multiple revalidation methods for Docker compatibility
  try {
    // Method 1: Tag-based revalidation
    revalidateTag('instances');
    
    // Method 2: Path-based revalidation
    revalidatePath('/');
    
    // Method 3: Direct API call (for Docker containers)
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;
    
    try {
      const response = await fetch(`${baseUrl}/api/revalidate`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Revalidation API response:', response.status);
    } catch (apiErr) {
      console.log('Revalidation API call failed:', apiErr);
    }
  } catch (revalErr) {
    console.log('Revalidation failed:', revalErr);
  }
  
  return NextResponse.json({ message: "successfully updated instances" });
} 