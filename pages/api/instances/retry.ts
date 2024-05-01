// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { InstanceFetcher } from "../util";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Invalid API Method" });
  }

  const allInstances = await prisma.instances.findMany({
    where: { banned: true, ban_reason: "Instance failed 5 checks in a row" },
  });
  for (let i = 0; i < allInstances.length; i++) {
    try {
      let updateInstance = await InstanceFetcher.checkAvailable(
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
            banned: false,
            ban_reason: "",
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
        res.status(400).json({ message: err.message });
      } else if (err instanceof PrismaClientValidationError) {
        res.status(400).json({ message: err.message });
      }
    }
  }
  res.status(200).json({ message: "successfully updated instances" });
};
