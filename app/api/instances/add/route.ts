// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest, NextResponse } from "next/server";
import generator from "megalodon";
import { ACCESS_TOKEN, BASE_URL } from "../../../../lib/config";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { prisma } from "../../../../lib/prisma";
import { InstanceFetcher } from "../../util";

const dotenv = require("dotenv");
dotenv.config();

export async function POST(request: NextRequest) {
  // Define the incoming POST Data
  const instanceData: {
    uri: string;
    type: string;
    nsfwflag: string;
    api_mode: string;
    instance_contact?: string;
  } = await request.json();

  // Function to parse through the URI and check if it's valid and return the data

  // Run through the URI test and collect the data
  // Then create the instance in the database
  if (
    (await InstanceFetcher.checkAvailable(
      instanceData.uri,
      instanceData.api_mode
    )) == false
  ) {
    // Return an error if the URI is invalid
    return NextResponse.json({ message: "failed to verify URI", type: "error" }, { status: 400 });
  } else {
    let cachedata = await InstanceFetcher.checkAvailable(
      instanceData.uri,
      instanceData.api_mode
    );
    if (cachedata != false) {
      try {
        // Fix issues when the cachedata thumbnail is null
        if (cachedata.thumbnail == null) {
          cachedata.thumbnail = "";
        }
        // Prepare the data to be saved to the database
        const savedInstance = await prisma.instances.create({
          data: {
            name: cachedata.title,
            api_mode: instanceData.api_mode,
            type: instanceData.type,
            nsfwflag: instanceData.nsfwflag,
            uri: instanceData.uri,
            verified: false,
            InstanceData: {
              create: {
                title: cachedata.title,
                description: cachedata.description,
                thumbnail: cachedata.thumbnail,
                user_count: cachedata.user_count,
                status_count: cachedata.status_count,
                registrations: cachedata.registrations,
                approval_required: cachedata.approval_required,
              },
            },
            ApiKeys: {
              create: {},
            },
          },
        });

        console.log(savedInstance);

        // Absolutely force the value to be false after creation!
        const unverifiedInstance = await prisma.instances.update({
          where: { uri: instanceData.uri },
          data: { verified: false },
        });

        const getAPIKey = await prisma.apiKeys.findFirst({
          where: { instance_id: savedInstance.id },
        });

        // Build the mastodon client
        const client = generator(
          "mastodon",
          process.env.MASTODON_URL,
          process.env.ACCESS_TOKEN
        );

        // Check if the user is allowed to submit the isntance
        if (instanceData.api_mode == "mastodon") {
          // Set the instacne contact
          let instanceContact = cachedata.instance_contact;
          
          // Validate the instance contact before posting
          if (!instanceContact || instanceContact.includes('instance.ext') || instanceContact.includes('instance.social') || instanceContact === 'null') {
            console.log('Invalid instance contact detected, skipping status post:', instanceContact);
            return NextResponse.json({
              message:
                "Added instance successfully, but could not send verification message due to invalid contact information.",
              type: "success",
            });
          }
          
          // Compose Toot
          let toot =
            "@" +
            instanceContact +
            "@" +
            instanceData.uri +
            " Hi there someone is attempting to register your instance on FurryFediverse, if this is you. Please click this link to finish the registration: https://furryfediverse.org/api/instances/verify/" +
            getAPIKey.api_key;
          client.postStatus(toot, { visibility: "direct" });
          return NextResponse.json({
            message:
              "Added instance successfully, your instance admin account needs to be verified! Check your DMs!",
            type: "success",
          });
        } else if (instanceData.api_mode == "misskey") {
          // Set the instance contact
          let instanceContact = instanceData.instance_contact;
          // Check submitted user is admin
          let adminVerify = {
            query: instanceContact,
            limit: 1,
            origin: "local",
            detail: true,
          };
          let init = {
            headers: { "Content-Type": "application/json;charset=UTF-8" },
            body: JSON.stringify(adminVerify),
            method: "POST",
          };
          let adminReq = await fetch(
            "https://" + instanceData.uri + "/api/users/search",
            init
          );
          let adminRes = await adminReq.json();
          if (adminRes[0].isAdmin == true) {
            console.log("Admin verification passed");
            // Compose Toot
            let toot =
              "@" +
              instanceContact +
              "@" +
              instanceData.uri +
              " Hi there someone is attempting to register your instance on FurryFediverse, if this is you. Please click this link to finish the registration: https://furryfediverse.org/api/instances/verify/" +
              getAPIKey.api_key;
            client.postStatus(toot, { visibility: "direct" });
            return NextResponse.json({
              message:
                "Added instance successfully, your instance admin account needs to be verified! Check your DMs!",
              type: "success",
            });
          } else {
            return NextResponse.json({
              message: "Administrator verification failed",
              type: "error",
            }, { status: 400 });
          }
        }
      } catch (err) {
        console.log(err);
        if (err instanceof PrismaClientKnownRequestError) {
          if (err.code === "P2002") {
            return NextResponse.json({
              message: "Instance already exists",
              type: "error",
            }, { status: 400 });
          } else {
            return NextResponse.json({
              message: err.message,
              type: "error",
            }, { status: 400 });
          }
        } else if (err instanceof PrismaClientValidationError) {
          return NextResponse.json({ message: err.message, type: "error" }, { status: 400 });
        }
      }
    }
  }
} 