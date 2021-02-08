import { basic } from "../../utils/time.ts";
import { deconstruct } from "../../utils/snowflake.ts";
import { Embed } from "../../types/embed.ts";

import { createCommand } from "../../utils/functions.ts";
import { botHasChannelPermissions } from "../../../deps.ts";

createCommand({
    name:"serverinfo",
    module: "info",
    description: "Get the information of the server.",
    execute: async (message, _, guild) => {
        if (!await botHasChannelPermissions(message.channelID, ["EMBED_LINKS"])) return await message.send("You have to give me `embed links` permission in this channel to use this command!")
        let created_at = await basic(await deconstruct(message.guildID))

        let verification = ["None", "Low", "Medium", "High", "very High"][guild.verificationLevel]
        let icon = guild.iconURL() as string
        let features = guild.features.join(", ").replace(/_/g, " ").toLowerCase()
		let verified = guild.verified ? "this server is verified" : "this server is not verified"
        let partner = guild.partnered ? "this server is partnered" : "this server is not partnered"
		let amounts = {
			channels: guild.channels.size,
			roles: guild.roles.size,
			members: guild.members.size,
			humans: guild.members.filter(e => !(e.bot as boolean)).size,
			bots: guild.members.filter(e => e.bot as boolean).size
        }
        let afk = {
            channel: guild.afkChannel,
            timeout: guild.afkTimeout
        }
        let sub = {
            count: guild.premiumSubscriptionCount,
            tier: ["No tier", "Tier 1", "Tier 2", "Tier 3"][guild.premiumTier]
        }
        let region = guild.region
		let embed = new Embed().setTitle(`${guild.name} server info:`)
		.setThumbnail(icon)
		.setColor("#42994b")
		.addField("Server owner:", guild.owner?.mention as string)
		.addField("Server creation date:", created_at)
		.addField("Verification level:", verification)
		.addField("Server region:", region)
		.addField("Server features", features)
		.addField("Verification and partnership:", `${verified}\n${partner}`)
		.addField("Server afk system:", `Afk channel: ${afk.channel ? afk.channel.mention : "There is no afk channel in this server"}\nAfk timeout: ${afk.timeout}`)
		.addField("Server boost:" ,`Boost tier: ${sub.tier}\nBoosters count: ${sub.count}`)
		.addField("Server stats:",  
`
Channel count: ${amounts.channels}	
Role count: ${amounts.roles}
Member count: ${amounts.members}
Human count: ${amounts.humans}
Bot count: ${amounts.bots}
`
        )
        message.send({embed})
    }
})