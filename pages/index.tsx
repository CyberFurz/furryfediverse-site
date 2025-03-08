import type { NextPage } from "next";
import Head from "next/head";
import { prisma } from "../lib/prisma";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ReactImageFallback from "react-image-fallback";
import { shuffleArray } from "../lib/instance-array-tools";
import AppButton from "../components/AppButton";

const Home: NextPage = ({ general, niche, ios, android }: any) => {
  const [active, setActive] = useState(0);
  const [variants, setVariants] = useState({
    initial: { x: "0%", "--divHeight": `0px` },
    animate: { x: "-55%", "--divHeight": `0px` },
  });

  function getRandomInstance(strings: string[]): string {
    const randomIndex = Math.floor(Math.random() * strings.length);
    return strings[randomIndex];
  }

  const suggestedInstances = [
    "https://floofy.tech/auth/sign_up",
    "https://bark.lgbt/auth/sign_up",
    "https://pawb.fun/auth/sign_up",
    "https://meemu.org/auth/sign_up",
    "https://woof.tech/auth/sign_up",
  ];
  const randomInstance = getRandomInstance(suggestedInstances);

  const generalDiv = React.useRef<HTMLDivElement>();
  const nicheDiv = React.useRef<HTMLDivElement>();

  useEffect(() => {
    let variantUpdate = () =>
      setVariants({
        initial: {
          x: "0%",
          "--divHeight": `${generalDiv.current.offsetHeight}px`,
        },
        animate: {
          x: "-55%",
          "--divHeight": `${nicheDiv.current.offsetHeight}px`,
        },
      });

    window.addEventListener("resize", () => {
      variantUpdate();
    });

    variantUpdate();
    shuffleArray(general);
    shuffleArray(niche);
  }, []);

  return (
    <div>
      <Head>
        <title>The Furry Fediverse</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <br />
      <div className="flex flex-col space-y-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="text-2xl card-title">
              What is the Furry Fediverse?
            </h2>
            <p>
              We are a collection of furry instances on the Fediverse, which is
              just a fancy way of saying we are a bunch of servers that federate
              together, allowing furries to join the wider Fediverse. To ease
              the confusion, Fediverse just means a collection of servers that
              all communicate with each other. Mastodon, Pleroma, Pixelfed, and
              more are all pieces of software that speak Activity Pub, which is
              the protocol the Fediverse runs on.
            </p>
            <p>
              There is no ownership of the wider Fediverse, just instances. All
              instances are operated by real people and not faceless companies
              (or at least the ones listed on this site). Which means you are
              moderated by other real furries and server costs are managed by
              your instance admins. Or if you are nerdy enough, you can host
              your own and federate with the rest of us!
            </p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="text-2xl card-title">Getting Started</h2>
            <p>
              Joining is simple and easy, just pick a server from below or click
              the button right below this paragraph to get started. Or if you
              are nerdy like stated before set up your own server... but I still
              think it is best to start out on an existing instance first. You
              will be able to move easily with all your followers if you want.
            </p>
            <div className="text-center">
              <a
                href={randomInstance}
                className="btn btn-primary normal-case text-lg flex flex-nowrap justify-between"
              >
                Join A Recommended Instance Now!
              </a>
            </div>
            <p>
              <strong>Note:</strong> You may feel like you should join a LARGE
              instance, but you should keep in mind the larger the instance, the
              most costly it is on your instance owner. Also, it doesn&apos;t
              matter what instance you are on, as you can follow and people can
              follow you, no matter which instance you join. We are all
              interconnected!
            </p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <p className="text-2xl">Tools To Get You Going!</p>
            <p className="font-bold py-4">Find Others on the Fediverse</p>
            <div className="px-2 flex flex-wrap justify-center w-full sm:w-fit gap-2">
              <a
                href="https://fediverse.info/explore/people?t=furry"
                className="btn btn-primary normal-case text-lg"
                target="_blank"
                rel="noreferrer"
              >
                <i
                  className="ml-2 fa-brands fa-mastodon"
                  aria-hidden="true"
                ></i>
                <span className="ml-2">Fediverse People Directory</span>
              </a>
            </div>
            <p className="font-bold py-4">
              Recommended Apps (in no particular order)
            </p>
            <div className="px-2 flex h-fit justify-center gap-x-8 gap-y-8 flex-wrap w-full sm:w-fit text-center">
              <div className="grid grid-flow-row grid-cols-1 gap-y-3">
                <p className="text-2xl">IOS</p>
                {ios.map(
                  (data: { name: string; paid: boolean; href: string }) => (
                    <AppButton
                      name={data.name}
                      paid={data.paid}
                      platform="ios"
                      href={data.href}
                    ></AppButton>
                  )
                )}
              </div>
              <div className="grid grid-flow-row grid-cols-1 gap-y-3">
                <p className="text-2xl">Android</p>
                {android.map(
                  (data: { name: string; paid: boolean; href: string }) => (
                    <AppButton
                      name={data.name}
                      paid={data.paid}
                      platform="android"
                      href={data.href}
                    ></AppButton>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl overflow-x-clip h-max">
          <div className="card-body">
            <h2 className="text-2xl card-title">Fediverse Instances</h2>
            <p>
              <strong>Note:</strong> The order of instances is randomized each
              time you reload the page, we do not endorse any instance over any
              other.
            </p>
            <p className="italic text-sm">
              To Opt-In To Being Displayed Here, please fill out{" "}
              <Link href="/add-instance" className="underline">
                This Form
              </Link>
            </p>
            <br />
            <ul className="tabs w-full grid grid-cols-2">
              <li
                key={0}
                data-tip="Instances open to furries of any kind with no specific topic"
                className={`text-2xl tab tab-bordered h-fit tooltip tooltip-primary w-full ${
                  0 === active && "tab-active"
                }`}
                onClick={() => setActive(0)}
              >
                General Instances
              </li>
              <li
                key={1}
                data-tip="Furry friendly instances with a focus on one or more topics"
                className={`text-2xl tab tab-bordered h-fit tooltip tooltip-primary w-full ${
                  1 === active && "tab-active"
                }`}
                onClick={() => setActive(1)}
              >
                Focused Instances
              </li>
            </ul>
            <br />
            <div className="">
              <motion.div
                key={0}
                variants={variants}
                initial="initial"
                animate={1 === active ? "animate" : "initial"}
                className="grid grid-cols-2 gap-[10%] w-[220%]"
                style={{ height: "var(--divHeight)" }}
              >
                <div
                  className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-min`}
                  ref={generalDiv}
                >
                  {general.map(
                    (data: {
                      id: string;
                      title: any;
                      thumbnail: any;
                      description: any;
                      short_description: any;
                      registrations: any;
                      approval_required: any;
                      uri: any;
                      user_count: any;
                      nsfwflag: any;
                    }) => (
                      <div
                        key={data.id}
                        className="card card-compact bg-base-300 shadow-xl"
                      >
                        <figure>
                          <ReactImageFallback
                            src={data.thumbnail}
                            fallbackImage="./img/fedi_placeholder.png"
                            initialImage="./img/fedi_placeholder.png"
                            className="max-h-52 w-full object-cover rounded-md pointer-events-none"
                            alt={data.title}
                            onLoad={() => updateVariants()}
                          />
                        </figure>
                        <div className="card-body">
                          <h2 className="card-title text-2xl text-center self-center">
                            {data.title}
                          </h2>
                          <div className="divider my-0"></div>
                          <p className="text-base">{data.description}</p>
                          <div className="divider my-0"></div>
                          <div className="card-actions justify-evenly">
                            <div className="text-lg w-min italic basis-full flex flex-rows items-center justify-center">
                              <i className="fa-solid fa-key mr-4"></i>
                              <div className="flex flex-wrap flex-rows w-min justify-center">
                                <span className="whitespace-nowrap w-min">
                                  {data.registrations
                                    ? "Registrations Open"
                                    : "Registrations Closed"}
                                </span>
                                <span className="whitespace-nowrap w-min">
                                  {data.approval_required
                                    ? "with Approval Required"
                                    : ""}
                                </span>
                              </div>
                            </div>
                            <div className="tooltip text-lg" data-tip="Members">
                              <i className="fa-solid fa-users"></i>{" "}
                              {data.user_count}
                            </div>
                            <div
                              className="tooltip text-lg"
                              data-tip="Content Rules"
                            >
                              <i className="fa-solid fa-user-shield"></i>{" "}
                              {data.nsfwflag}
                            </div>
                            <a
                              href={
                                data.uri.includes("https")
                                  ? data.uri
                                  : "https://" + data.uri
                              }
                              className="btn btn-primary normal-case text-xl w-full mt-2"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Visit Instance
                            </a>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
                <div
                  className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-min`}
                  ref={nicheDiv}
                >
                  {niche.map(
                    (data: {
                      id: string;
                      title: any;
                      thumbnail: any;
                      description: any;
                      short_description: any;
                      registrations: any;
                      approval_required: any;
                      uri: any;
                      user_count: any;
                      nsfwflag: any;
                    }) => (
                      <div
                        key={data.id}
                        className="card card-compact bg-base-300 shadow-xl"
                      >
                        <figure>
                          <ReactImageFallback
                            src={data.thumbnail}
                            fallbackImage="./img/fedi_placeholder.png"
                            initialImage="./img/fedi_placeholder.png"
                            className="max-h-52 w-full object-cover rounded-md pointer-events-none"
                            alt={data.title}
                            onLoad={() => updateVariants()}
                          />
                        </figure>
                        <div className="card-body">
                          <h2 className="card-title text-2xl text-center self-center">
                            {data.title}
                          </h2>
                          <div className="divider my-0"></div>
                          <p className="text-base">{data.description}</p>
                          <div className="divider my-0"></div>
                          <div className="card-actions justify-evenly">
                            <div className="text-lg w-min italic basis-full flex flex-rows items-center justify-center">
                              <i className="fa-solid fa-key mr-4"></i>
                              <div className="flex flex-wrap flex-rows w-min justify-center">
                                <span className="whitespace-nowrap w-min">
                                  {data.registrations
                                    ? "Registrations Open"
                                    : "Registrations Closed"}
                                </span>
                                <span className="whitespace-nowrap w-min">
                                  {data.approval_required
                                    ? "with Approval Required"
                                    : ""}
                                </span>
                              </div>
                            </div>
                            <div className="tooltip text-lg" data-tip="Members">
                              <i className="fa-solid fa-users"></i>{" "}
                              {data.user_count}
                            </div>
                            <div
                              className="tooltip text-lg"
                              data-tip="Content Rules"
                            >
                              <i className="fa-solid fa-user-shield"></i>{" "}
                              {data.nsfwflag}
                            </div>
                            <a
                              href={
                                data.uri.includes("https")
                                  ? data.uri
                                  : "https://" + data.uri
                              }
                              className="btn btn-primary normal-case text-xl w-full mt-2"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Visit Instance
                            </a>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </motion.div>
              <br />
              <p className="italic text-sm text-right">
                <Link href="/report-instance" className="underline">
                  Report Instance
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function updateVariants() {
    setVariants({
      initial: {
        x: "0%",
        "--divHeight": `${generalDiv.current.offsetHeight}px`,
      },
      animate: {
        x: "-55%",
        "--divHeight": `${nicheDiv.current.offsetHeight}px`,
      },
    });
  }
};

// This gets called on every request
export async function getStaticProps() {
  // Interface pre-requisites
  interface ServerData {
    cache: any;
  }

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

  // Pass data to the page via props
  return {
    props: {
      general: generalInstances,
      niche: nichelInstances,
      ios: iosApps,
      android: androidApps,
    },
    revalidate: 60,
  };
}

export default Home;
