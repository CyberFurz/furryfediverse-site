export class InstanceFetcher {
    public static async checkAvailable(instanceURI: string, instanceType: string) {
        let init = undefined;
        let metaURI = '';
        switch (instanceType) {
            case 'mastodon':
                init = {headers: {'Content-Type': 'application/json;charset=UTF-8'}}
                metaURI = 'https://' + instanceURI + '/api/v1/instance'
                try {
                    const fetchingData = await fetch(metaURI, init)
                    const mastodonData = await fetchingData.json()
                    const parsedMasterData = {
                        title: mastodonData.title,
                        description: mastodonData.short_description !== undefined ? mastodonData.short_description : mastodonData.description, // Pleroma instances don't have a short_description field, so we use the description field instead
                        thumbnail: mastodonData.thumbnail,
                        user_count: mastodonData.stats.user_count,
                        status_count: mastodonData.stats.status_count,
                        instance_contact: mastodonData.contact_account.username,
                        registrations: mastodonData.registrations,
                        approval_required: mastodonData.approval_required,
                    }
                    return parsedMasterData
                } catch (err) {
                    return false
                }
            case 'misskey':
                let getDetails = {detail: true}
                init = {
                    headers: {'Content-Type': 'application/json;charset=UTF-8'},
                    body: JSON.stringify(getDetails),
                    method: 'POST'
                }
                metaURI = 'https://' + instanceURI + '/api/meta'
                let statsURI = 'https://' + instanceURI + '/api/stats'
                try {
                    const fetchingData = await fetch(metaURI, init)
                    const fetchingData2 = await fetch(statsURI, init)
                    const misskeyMetaData = await fetchingData.json()
                    const misskeyStatsData = await fetchingData2.json()
                    const parsedMasterData = {
                        title: misskeyMetaData.name,
                        description: misskeyMetaData.description,
                        thumbnail: misskeyMetaData.bannerUrl,
                        user_count: misskeyStatsData.originalUsersCount,
                        status_count: misskeyStatsData.notesCount,
                        instance_contact: 'null',
                        registrations: misskeyMetaData.disableRegistration === false,
                        approval_required: false,
                    }
                    return parsedMasterData
                } catch (err) {
                    return false
                }
            case "funkwhale":
                init = {
                    headers: {'Content-Type': 'application/json;charset=UTF-8'}
                }
                metaURI = `https://${instanceURI}/api/v1/instance/nodeinfo/2.0/`
                try {
                    const fetchingData = await fetch(metaURI);
                    const funkwhaleData = await fetchingData.json()
                    const parsedMasterData = {
                        title: funkwhaleData.metadata.nodeName,
                        description: funkwhaleData.metadata.shortDescription,
                        thumbnail: funkwhaleData.banner,
                        user_count: funkwhaleData.usage.users.total,
                        status_count: funkwhaleData.metadata.library.tracks.total,
                        instance_contact: funkwhaleData.metadata.contactemail,
                        registrations: funkwhaleData.openRegistrations,
                        approval_required: false,
                    }
                    return parsedMasterData
                } catch (err) {
                    return false
                }
            default:
                return false
        }
    }
}
