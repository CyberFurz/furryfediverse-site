// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { prisma } from '../../../../lib/prisma'

export async function POST(request: NextRequest) {
    const instanceData = await request.json()
    
    /*async function checkKey(instanceKey: string, instanceURI: string) {
        const instanceEntry = await prisma.instances.findFirst({ where: { uri: instanceURI }, select: { api_key: true } })
        if (instanceEntry) {
            if (instanceEntry.ApiKey === instanceKey) {
                return true
            }else{
                return false
            }
        }
    }
    
    if (await checkKey(instanceData.uri, instanceData.key) == false) {
        return NextResponse.json({"message": "Incorrect API Key"}, { status: 400 })
    } else {
        try {
            const savedInstance = await prisma.instances.delete({
                where: { uri: instanceData.uri }
            })
            return NextResponse.json({"message": "Instance deleted successfully"})
        } catch (err) {
            if (err instanceof PrismaClientKnownRequestError){
                if (err.code === 'P2025'){
                    return NextResponse.json({"message": "instance not in database"}, { status: 400 })
                }else{
                    return NextResponse.json({"message": err.message }, { status: 400 })
                }
            }
        }
    }*/

} 