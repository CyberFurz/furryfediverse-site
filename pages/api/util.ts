import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { URL } from "url";

export class InstanceFetcher {
  public static async checkAvailable(
    instanceURI: string,
    instanceType: string
  ) {
    let init = undefined;
    let metaURI = "";
    let parsedMasterData: any = {};
    switch (instanceType) {
      case "mastodon":
        init = {
          headers: { "Content-Type": "application/json;charset=UTF-8" },
        };
        metaURI = "https://" + instanceURI + "/api/v1/instance";
        try {
          const fetchingData = await fetch(metaURI, init);
          const mastodonData = await fetchingData.json();
          parsedMasterData = {
            title: mastodonData.title,
            description:
              mastodonData.short_description !== undefined
                ? mastodonData.short_description
                : mastodonData.description,
            thumbnail: mastodonData.thumbnail,
            user_count: mastodonData.stats.user_count,
            status_count: mastodonData.stats.status_count,
            instance_contact: mastodonData.contact_account.username,
            registrations: mastodonData.registrations,
            approval_required: mastodonData.approval_required,
          };
        } catch (err) {
          return false;
        }
        break;
      case "misskey":
        let getDetails = { detail: true };
        init = {
          headers: { "Content-Type": "application/json;charset=UTF-8" },
          body: JSON.stringify(getDetails),
          method: "POST",
        };
        metaURI = "https://" + instanceURI + "/api/meta";
        let statsURI = "https://" + instanceURI + "/api/stats";
        try {
          const fetchingData = await fetch(metaURI, init);
          const fetchingData2 = await fetch(statsURI, init);
          const misskeyMetaData = await fetchingData.json();
          const misskeyStatsData = await fetchingData2.json();
          parsedMasterData = {
            title: misskeyMetaData.name,
            description: misskeyMetaData.description,
            thumbnail: misskeyMetaData.bannerUrl,
            user_count: misskeyStatsData.originalUsersCount,
            status_count: misskeyStatsData.notesCount,
            instance_contact: "null",
            registrations: misskeyMetaData.disableRegistration === false,
            approval_required: false,
          };
        } catch (err) {
          return false;
        }
        break;
      case "funkwhale":
        init = {
          headers: { "Content-Type": "application/json;charset=UTF-8" },
        };
        metaURI = `https://${instanceURI}/api/v1/instance/nodeinfo/2.0/`;
        try {
          const fetchingData = await fetch(metaURI);
          const funkwhaleData = await fetchingData.json();
          parsedMasterData = {
            title: funkwhaleData.metadata.nodeName,
            description: funkwhaleData.metadata.shortDescription,
            thumbnail: funkwhaleData.banner,
            user_count: funkwhaleData.usage.users.total,
            status_count: funkwhaleData.metadata.library.tracks.total,
            instance_contact: funkwhaleData.metadata.contactemail,
            registrations: funkwhaleData.openRegistrations,
            approval_required: false,
          };
        } catch (err) {
          return false;
        }
        break;
      default:
        return false;
    }

    if (parsedMasterData.thumbnail) {
      console.log("Caching thumbnail");
      parsedMasterData.thumbnail = await this.cacheThumbnail(
        parsedMasterData.thumbnail,
        instanceURI
      );
    }
    return parsedMasterData;
  }

  private static async cacheThumbnail(
    thumbnailUrl: string,
    instanceURI: string
  ): Promise<string> {
    try {
      const response = await fetch(thumbnailUrl);
      if (!response.ok) throw new Error("Failed to fetch thumbnail");

      const buffer = await response.buffer();
      const cacheDir = path.resolve(
        process.cwd(),
        "public/img/cache",
        instanceURI
      );
      if (!fs.existsSync(cacheDir)) {
        console.log(`Creating cache directory: ${cacheDir}`);
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const url = new URL(thumbnailUrl);
      const ext = path.extname(url.pathname);
      const filePath = path.join(cacheDir, `thumbnail${ext}`);
      console.log(`Saving thumbnail to: ${filePath}`);
      fs.writeFileSync(filePath, buffer);

      return `/img/cache/${instanceURI}/thumbnail${ext}`;
    } catch (err) {
      console.error("Error caching thumbnail:", err);
      return thumbnailUrl; // Fallback to original URL if caching fails
    }
  }
}
