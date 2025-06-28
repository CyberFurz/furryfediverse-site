// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest, NextResponse } from "next/server"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime"
import { prisma } from "../../../../../lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key: apikey } = await params

  async function checkKey(instanceKey: string) {
    const instanceEntry = await prisma.apiKeys.findFirst({
      where: { api_key: instanceKey }
    })
    if (instanceEntry) {
      await prisma.apiKeys.update({
        where: { api_key: instanceKey },
        data: { used: true }
      })
      return instanceEntry.instance_id
    } else {
      return "failed"
    }
  }

  if ((await checkKey(apikey)) == "failed") {
    return NextResponse.json({ message: "Incorrect API Key" }, { status: 400 })
  } else {
    try {
      let check = await checkKey(apikey)
      const verifiedInstance = await prisma.instances.update({
        where: { id: check },
        data: { verified: true },
      })
      return NextResponse.json({ message: "Instance added successfully" })
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          return NextResponse.json({ message: "instance not in database" }, { status: 400 })
        } else {
          return NextResponse.json({ message: err.message }, { status: 400 })
        }
      }
    }
  }
} 