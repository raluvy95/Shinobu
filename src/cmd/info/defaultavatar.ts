import { createCommand } from "../../utils/functions.ts";
import { Embed } from "../../types/embed.ts";
import { endpoints } from "https://raw.githubusercontent.com/discordeno/discordeno/master/src/util/constants.ts";
import { botHasChannelPermissions,  } from "../../../deps.ts";

createCommand({
    name:"defaultavatar",
    module:"info",
    description: "Get the default avatar of a certain member.",
    usage: "[member]",
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
        let avatar = endpoints.USER_DEFAULT_AVATAR(Number(member.discriminator) % 5)
        let embed = new Embed()
            .setAuthor(member.tag, avatar)
            .setImage(avatar)
            .setTimestamp()
        await message.send({embed})
    }
})