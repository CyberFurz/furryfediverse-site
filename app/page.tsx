import { prisma } from "../lib/prisma";
import HomeClient from "./HomeClient";

// This gets called on every request
async function getData() {
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

  // Fetch data from external API
  const generalInstance = await prisma.instances.findMany({
    where: { type: "general", verified: true, banned: false },
  });
  const nicheInstance = await prisma.instances.findMany({
    where: { type: "niche", verified: true, banned: false },
  });

  // Build the array from the list of servers
  let generalInstances = [];
  for (let i of generalInstance) {
    let serverData = await prisma.instanceData.findFirst({
      where: { instance_id: i.id },
    });
    generalInstances.push({
      id: i.id,
      title: serverData.title,
      thumbnail: serverData.thumbnail,
      description: serverData.description,
      registrations: serverData.registrations,
      approval_required: serverData.approval_required,
      user_count: serverData.user_count,
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
      title: serverData.title,
      thumbnail: serverData.thumbnail,
      description: serverData.description,
      registrations: serverData.registrations,
      approval_required: serverData.approval_required,
      user_count: serverData.user_count,
      nsfwflag: i.nsfwflag,
      uri: i.uri,
    });
  }

  return {
    general: generalInstances,
    niche: nichelInstances,
    ios: iosApps,
    android: androidApps,
  };
}

// Enable ISR - revalidate every 5 minutes (300 seconds)
export const revalidate = 300;

export default async function Home() {
  const data = await getData();
  
  return <HomeClient {...data} />;
} 