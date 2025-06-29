'use client'

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ReactImageFallback from "react-image-fallback";
import { shuffleArray } from "../lib/instance-array-tools";
import AppButton from "../components/AppButton";

interface InstanceData {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  registrations: boolean;
  approval_required: boolean;
  user_count: number;
  nsfwflag: string;
  uri: string;
}

interface AppData {
  name: string;
  paid: boolean;
  href: string;
}

interface HomeClientProps {
  general: InstanceData[];
  niche: InstanceData[];
  ios: AppData[];
  android: AppData[];
}

export default function HomeClient({ general, niche, ios, android }: HomeClientProps) {
  const [active, setActive] = useState(0);
  const [variants, setVariants] = useState({
    initial: { x: "0%" },
    animate: { x: "-50%" },
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
  ];
  const randomInstance = getRandomInstance(suggestedInstances);

  useEffect(() => {
    shuffleArray(general);
    shuffleArray(niche);
  }, []);

  return (
    <div>
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
                      key={data.name}
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
                      key={data.name}
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
        <div className="card bg-base-100 shadow-xl">
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
                Niche Instances
              </li>
            </ul>
            <div className="relative">
              {active === 0 && (
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {general.map((data: InstanceData) => (
                    <div
                      key={data.id}
                      className="card bg-base-300 shadow-xl"
                    >
                      <figure className="px-4 pt-4">
                        <img
                          src={data.thumbnail}
                          alt={data.title}
                          className="max-h-52 w-full object-cover rounded-md pointer-events-none"
                          onError={e => { e.currentTarget.src = '/img/fedi_placeholder.png'; }}
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
                  ))}
                </div>
              )}
              {active === 1 && (
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {niche.map((data: InstanceData) => (
                    <div
                      key={data.id}
                      className="card bg-base-300 shadow-xl"
                    >
                      <figure className="px-4 pt-4">
                        <img
                          src={data.thumbnail}
                          alt={data.title}
                          className="max-h-52 w-full object-cover rounded-md pointer-events-none"
                          onError={e => { e.currentTarget.src = '/img/fedi_placeholder.png'; }}
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
                  ))}
                </div>
              )}
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
} 