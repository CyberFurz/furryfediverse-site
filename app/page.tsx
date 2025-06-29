import { Suspense } from 'react'
import HomeClient from './HomeClient'
import { prisma } from '@/lib/prisma'

// Revalidate every 5 minutes
export const revalidate = 300

async function getData() {
  console.log('Homepage getData called at:', new Date().toISOString());
  
  let iosApps = [
    {
      name: "Ice Cubes",
      paid: false,
      href: "https://apps.apple.com/gb/app/ice-cubes-for-mastodon/id6444915884",
    },
    {
      name: "Ivory",
      paid: true,
      href: "https://apps.apple.com/us/app/ivory-for-mastodon-by-tapbots/id6444602274",
    },
    {
      name: "Trunks",
      paid: false,
      href: "https://apps.apple.com/us/app/trunks-for-mastodon/id6444749479",
    },
    {
      name: "Toot!",
      paid: true,
      href: "https://apps.apple.com/us/app/toot/id1229021451",
    },
  ];

  let androidApps = [
    {
      name: "Moshidon",
      paid: false,
      href: "https://lucasggamerm.github.io/moshidon/",
    },
    {
      name: "Rodent",
      paid: false,
      href: "https://mastodonrodent.app/",
    },
    {
      name: "Trunks",
      paid: false,
      href: "https://play.google.com/store/apps/details?id=com.decad3nce.trunks&pcampaignid=web_share",
    },
    {
      name: "Fedilab",
      paid: false,
      href: "https://fedilab.app",
    },
  ];

  // Fetch data from database with cache tag
  const generalInstance = await prisma.instances.findMany({
    where: { type: "general", verified: true, banned: false },
  });
  const nicheInstance = await prisma.instances.findMany({
    where: { type: "niche", verified: true, banned: false },
  });

  console.log(`Found ${generalInstance.length} general instances and ${nicheInstance.length} niche instances`);

  // Build the array from the list of servers
  let generalInstances = [];
  for (let i of generalInstance) {
    let serverData = await prisma.instanceData.findFirst({
      where: { instance_id: i.id },
    });
    generalInstances.push({
      id: i.id,
      title: serverData?.title || "",
      thumbnail: serverData?.thumbnail || "",
      description: serverData?.description || "",
      registrations: serverData?.registrations || false,
      approval_required: serverData?.approval_required || false,
      user_count: serverData?.user_count || 0,
      nsfwflag: i.nsfwflag,
      uri: i.uri,
    });
  }

  // Build the array from the list of servers
  let nichelInstances = [];
  for (let i of nicheInstance) {
    let serverData = await prisma.instanceData.findFirst({
      where: { instance_id: i.id },
    });
    nichelInstances.push({
      id: i.id,
      title: serverData?.title || "",
      thumbnail: serverData?.thumbnail || "",
      description: serverData?.description || "",
      registrations: serverData?.registrations || false,
      approval_required: serverData?.approval_required || false,
      user_count: serverData?.user_count || 0,
      nsfwflag: i.nsfwflag,
      uri: i.uri,
    });
  }

  console.log('Homepage data fetched successfully at:', new Date().toISOString());

  return {
    general: generalInstances,
    niche: nichelInstances,
    ios: iosApps,
    android: androidApps,
  };
}

export default async function Home() {
  const data = await getData()
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeClient {...data} />
    </Suspense>
  )
} 