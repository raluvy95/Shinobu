import { highestRole, Role, avatarURL, botHasChannelPermissions } from "../../../deps.ts";
import { deconstruct } from "../../utils/snowflake.ts";
import { basic } from "../../utils/time.ts";
import { Embed } from "../../types/embed.ts";
import { createCommand } from "../../utils/functions.ts";

createCommand({
    name:"userinfo",
    aliases: ["info"],
    module:"info",
    usage: "[member]",
    description: "Get information of a member inside the server",
    execute: async (message, args, guild) => {
        if (!await botHasChannelPermissions(message.channelID, ["EMBED_LINKS"])) return await message.send("You have to give me `embed links` permission in this channel to use this command!")
        let member = message.mentionedMembers[0]
        if (!member) {
            member = guild.members.find(e => e.id == args.join(" ") || e.username == args.join(" ") || e.tag == args.join(" "))
            if (!member) {
                member = message.member 
                if (!member) return
            }
        }
        let timestamp = await deconstruct(member.id)
        let created_at = await basic(timestamp)
        let joined_timestamp = member.guildMember(message.guildID)?.joinedAt as number
        let joined_at = await basic(joined_timestamp)
        let role = (await highestRole(message.guildID, member.id)) as Role
        let color = role.hexColor
        let guildMember = member.guildMember(message.guildID)
        if (!guildMember) return
        let roles = guildMember.roles.length
        let bot = (member.bot as boolean) ? "this member is a bot" : "this member is not a bot"
        let displayedName = member.name(message.guildID)
        let embed = new Embed()
            .setTitle(`${member.tag}'s user info:`)
			.addField("displayed name on the server:", displayedName)
			.addField("displayed color hex:", `#${color}`)
			.addField("is this member a bot:", bot)
			.addField("member created at:", created_at)
			.addField("member joined at:", joined_at)
			.addField("amount of roles:", `this member has ${roles} roles`)
            .addField("highest role:", role.mention)
			.setColor(color)
			.setThumbnail(avatarURL(member))
            .setTimestamp()
        await message.send({embed})
    }
})