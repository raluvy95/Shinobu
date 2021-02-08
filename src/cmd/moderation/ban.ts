import { ban, highestRole, botHasPermission } from "../../../deps.ts";
import { createCommand, log } from "../../utils/functions.ts";
import { Embed } from "../../types/embed.ts";
import { usageEmbed } from "../../utils/embeds.ts";

createCommand({
    name:"ban",
    module:"moderation",
    description: "ban a certain member.",
    usage: "<member> [reason]",
    permission: ["BAN_MEMBERS"],
    execute: async (message, args) => {
        if (!message.guild) return
        if (!args[0]) return await message.send({embed: usageEmbed("ban", "<member> [reason]")})
        let member = message.mentionedMembers[0]
        if (!member) {
            member = message.guild?.members.find(e => e.id == args.join(" ") || e.username == args.join(" ") || e.tag == args.join(" "))
            if (!member) return await message.send("That's not a valid member.")
        }
        args.shift()
        if (!message.guild) return
        if (!(await botHasPermission(message.guildID, ["BAN_MEMBERS"]))) return await message.send("I don't have enough permissions to ban this member.")
        if ((await highestRole(message.guild.id, member.id) as any).position > (await highestRole(message.guildID, message.author.id) as any).position) return message.send("I can't ban this member since they have a higher role than you.")
        await ban(message.guildID, member.id, {reason: (args[0] ? args.join(" ") : "No reason.")})
        await message.send({content: `Successfuly banned ${member.tag} for ${args[0] ? args.join(" ") : "No reason."}`, mentions: {parse: []}})
        let embed = new Embed()
            .setTitle("A member got banned:")
            .addField("Banned by:", message.member?.tag as string)
            .addField("Banned member:", `${member.tag}`)
            .addField("Reason:", args[0] ? args.join(" ") : "No reason.")
            .setTimestamp()
        await log(embed, message.guild)
    }
})