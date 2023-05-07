// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import { Prisma } from "@prisma/client"
import prismac from "../../../../lib/prisma"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { key } = req.query
  const apikey = key as unknown as string
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Invalid API Method" })
  }

  const instanceData = req.body

  async function checkKey(instanceKey: string) {
    const instanceEntry = await prismac.apiKeys.findFirst({
      where: { api_key: instanceKey }
    })
    if (instanceEntry) {
      await prismac.apiKeys.update({
        where: { api_key: instanceKey },
        data: { used: true }
      })
      return instanceEntry.instance_id
    } else {
      return "failed"
    }
  }

  if ((await checkKey(apikey)) == "failed") {
    res.status(400).json({ message: "Incorrect API Key" })
  } else {
    try {
      let check = await checkKey(apikey)
      const verifiedInstance = await prismac.instances.update({
        where: { id: check },
        data: { verified: true },
      })
      res.status(200).json({ message: "Instance added successfully" })
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          res.status(400).json({ message: "instance not in database" })
        } else {
          res.status(400).json({ message: err.message })
        }
      }
    }
  }
}
