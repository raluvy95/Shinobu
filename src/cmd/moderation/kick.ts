import { kick, highestRole, botHasPermission } from "../../../deps.ts";
import { createCommand, log } from "../../utils/functions.ts";
import { Embed } from "../../types/embed.ts";
import { usageEmbed } from "../../utils/embeds.ts";

createCommand({
    name:"kick",
    module:"moderation",
    description: "Kick a certain member.",
    usage: "<member> [reason]",
    permission: ["KICK_MEMBERS"],
    execute: async (message, args, guild) => {
        if (!args[0]) return await message.send({embed: usageEmbed("kick", "<member> [reason]")})
        let member = message.mentionedMembers[0]
        if (!member) {
            member = message.guild?.members.find(e => e.id == args.join(" ") || e.username == args.join(" ") || e.tag == args.join(" "))
            if (!member) return await message.send("That's not a valid member.")
        }
        if(member.id == message.author.id) returm await message.send("You can't kick yourself")
        args.shift()
        if (!(await botHasPermission(message.guildID, ["KICK_MEMBERS"]))) return await message.send("I don't have enough permissions to kick this member.")
        if ((await highestRole(guild.id, member.id) as any).position > (await highestRole(message.guildID, message.author.id) as any).position) return message.send("I can't kick this member since they have a higher role than you.")
        await kick(message.guildID, member.id, (args[0] ? args.join(" ") : "No reason."))
        await message.send({content: `Successfuly kicked ${member.tag} for ${args[0] ? args.join(" ") : "No reason."}`, mentions: {parse: []}})
        let embed = new Embed()
            .setTitle("A member got kicked:")
            .addField("Kicked by:", message.member?.tag as string)
            .addField("Kicked member:", `${member.tag}`)
            .addField("Reason:", args[0] ? args.join(" ") : "No reason.")
            .setTimestamp()
        await log(embed, guild)
    }
})
