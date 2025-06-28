import { prisma } from "../../lib/prisma"
import { sortInstances } from "../../lib/instance-array-tools"
import ReportInstanceClient from "./ReportInstanceClient"

async function getData() {
    // Fetch data from external API
    const instances = await prisma.instances.findMany({
        where: { verified: true },
    })
    
    sortInstances(instances)
    
    return {
        instances: instances,
    }
}

export default async function ReportInstance() {
    const data = await getData();
    
    return <ReportInstanceClient instances={data.instances} />;
} 