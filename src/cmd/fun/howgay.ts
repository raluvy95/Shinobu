import { botHasChannelPermissions } from "../../../deps.ts";
import { Embed } from "../../types/embed.ts";
import { createCommand } from "../../utils/functions.ts";

createCommand({
    name:"howgay",
    aliases:["gay"],
    module:"fun",
    usage: "[member]",
    description:"Make the bot measure how gay someone is.",
    execute: async (message, args) => {
        if (!await botHasChannelPermissions(message.channelID, ["EMBED_LINKS"])) return await message.send("You have to give me `embed links` permission in this channel to use this command!")
        let member = message.mentionedMembers[0]
        if (!member) {
            member = message.guild?.members.find(e => e.id == args.join(" ") || e.username == args.join(" ") || e.tag == args.join(" "))
            if (!member) {
                member = message.member
                if (!member) return
            }
        }
        let percentage = Math.floor(Math.random() * 101)
        let embed = new Embed()
            .setTitle("Howgay command:")
            .setDescription(`<@${member?.id}> is ${percentage}% gay`)
            .setColor("random")
        await message.send({embed})
    }
})