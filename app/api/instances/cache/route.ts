// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { InstanceFetcher } from "../../util";
import { revalidateTag } from "next/cache";

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
        updateInstance.thumbnail = "";
      }
      if (updateInstance != false) {
        await prisma.instanceData.update({
          where: { instance_id: allInstances[i].id },
          data: {
            title: updateInstance.title,
            description: updateInstance.description,
            thumbnail: updateInstance.thumbnail,
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
  
  // Revalidate the homepage using tag-based revalidation
  revalidateTag('instances');
  
  // Also trigger revalidation via API endpoint as backup
  try {
    const baseUrl = process.env.VERCEL_URL || 'http://localhost:3000';
    await fetch(`${baseUrl}/api/revalidate`, { method: 'POST' });
  } catch (err) {
    console.log('Revalidation API call failed:', err);
  }
  
  return NextResponse.json({ message: "successfully updated instances" });
} 