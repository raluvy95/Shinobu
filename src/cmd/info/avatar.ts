import { createCommand } from "../../utils/functions.ts";
import { avatarURL, botHasChannelPermissions } from "../../../deps.ts";
import { Embed } from "../../types/embed.ts";

createCommand({
    name:"avatar",
    module:"info",
    usage: "[member]",
    description: "Get the current profile picture of a certain member.",
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
        let avatar = avatarURL(member)
        let embed = new Embed()
            .setAuthor(member.tag, avatar)
            .setImage(avatar)
            .setTimestamp()
        await message.send({embed})
    }
})