import { removeRole, botHasPermission, highestRole } from "../../../deps.ts";
import { botcache } from "../../types/cache.ts";
import { createCommand, log } from "../../utils/functions.ts";
import { Embed } from "../../types/embed.ts";
import { usageEmbed } from "../../utils/embeds.ts";

createCommand({
    name:"unmute",
    module:"moderation",
    usage: "<member>",
    description: "Unmute a certain member.",
    permission: ["MANAGE_ROLES"],
    execute: async (message, args) => {
        let members = (await botcache.db.muted.get(message.guildID))?.members
        if (!message.guild) return
        if (!args[0]) return await message.send({embed: usageEmbed("unmute <member>")})
        let member = message.mentionedMembers[0]
        if (!member) {
            member = message.guild?.members.find(e => e.id == args.join(" ") || e.username == args.join(" ") || e.tag == args.join(" "))
            if (!member) return await message.send("That's not a valid member.")
        }
        let config;
        if (botcache.db.config.has(message.guildID)) config = botcache.db.config.get(message.guildID)
        let mutedMember = members?.find(e => e.id == member?.id)
        if (!mutedMember) {
            if (!(await botHasPermission(message.guildID, ["MANAGE_ROLES"]))) return await message.send("I don't have enough permissions to unmute this member.")
            let roleID = (await botcache.db.config.get(message.guildID))?.muted
            if (!roleID) return message.send("There is no muted role set.")
            let role = message.guild.roles.get(roleID)
            if (!role) return await message.send("The muted role doesn't exist!")
            if ((await highestRole(message.guildID, message.author.id))?.position as number < role.position) return await message.send("I can't unmute this member since they have a higher role than you!")
            if ((await highestRole(message.guildID, message.author.id))?.position as number < role.position) return await message.send("I can't unmute this member since my role isn't high enough to remove the muted role!")
            if (member.guildMember(message.guildID)?.roles.includes(roleID)) return await message.send("This member isn't muted.")
            await removeRole(message.guildID, member.id, roleID)
            await message.send("Member unmuted successfuly!")
            let embed = new Embed()
                .setTitle("A member got unmuted:")
                .addField("Member", member.tag)
                .addField("Unmuted by:", message.member?.tag as string)
                .setTimestamp()
            await log(embed, message.guild)
        } else {
            let roleID = mutedMember.role
            
            let role = message.guild.roles.get(roleID)
            if (!role) {
                if (!config) return await message.send("There's no muted role!")
                role = message.guild.roles.get(roleID)
                if (!role) return await message.send("The muted role doesn't exist!")
            }
            if ((await highestRole(message.guildID, message.author.id))?.position as number < role.position) return await message.send("I can't unmute this member since they have a higher role than you!")
            if ((await highestRole(message.guildID, message.author.id))?.position as number < role.position) return await message.send("I can't unmute this member since my role isn't high enough to remove the muted role!")
            let mutedMembers = members?.filter(e => e.id != member?.id)
            await botcache.db.muted.update(message.guild.id, {members: mutedMembers})
            await removeRole(message.guildID, member.id, roleID as string)
            await message.send("Member unmuted successfuly!")
            let embed = new Embed()
                .setTitle("A member got unmuted:")
                .addField("Member", member.tag)
                .addField("Unmuted by:", message.member?.tag as string)
                .setTimestamp()
            await log(embed, message.guild)
        }
    }
})