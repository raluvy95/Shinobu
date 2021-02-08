import { highestRole, sleep, addRole, removeRole, botHasPermission, botID } from "../../../deps.ts";
import { botcache } from "../../types/cache.ts";
import { createCommand, log } from "../../utils/functions.ts";
import { Embed } from "../../types/embed.ts";
import { usageEmbed } from "../../utils/embeds.ts";
import { StringToTime, TimeToString } from "../../utils/time.ts";
createCommand({
    name:"mute",
    module:"moderation",
    description: "Mute a member.",
    usage: "<member> [time]",
    permission: ["MANAGE_ROLES"],
    execute: async (message, args, guild) => {
        if (!args[0]) return await message.send({embed: usageEmbed("mute", "<member> [time]")})
        let member = message.mentionedMembers[0]
        if (!member) {
            member = message.guild?.members.find(e => e.id == args.join(" ") || e.username == args.join(" ") || e.tag == args.join(" "))
            if (!member) return await message.send("That's not a valid member.")
        }
        args.shift()
        let roleID = (await botcache.db.config.get(message.guildID))?.muted
        if (!roleID) return await message.send("You have to set up a muted role.")
        let role = guild.roles.find(e => e.id == roleID)
        if (!role) {
            await botcache.db.config.update(message.guildID, {muted: undefined})
            return await message.send("The muted role doesn't exist.")
        }
        let role1 = await highestRole(message.guildID, message.author.id)
        let role2 = await highestRole(message.guildID, member.id)
        if (member.id == message.author.id) return await message.send("You can't mute yourself.")
        if (!role1 || !role2) return
        if (role1.position <= role2.position) return await message.send("That member has a higher role than you.")
        if ((await highestRole(message.guildID, botID))?.position as number < role.position) return await message.send("My role isn't high enough to mute this member!")
        if (member.guildMember(guild.id)?.roles.includes(roleID)) return await message.send("This member is already muted.")
        if (args[0]) {
            if (!(await botHasPermission(message.guildID, ["MANAGE_ROLES"]))) return await message.send("I don't have enough permissions to mute this member.")
            let timeout = await StringToTime(message, args[0])
            if (!timeout) return
            let mutedMembers = (await botcache.db.muted.get(message.guildID))?.members
            if (!mutedMembers) mutedMembers = []
            mutedMembers.push({id: member.id,role: roleID, unmute: Date.now() + timeout})
            if (!await botcache.db.muted.has(message.guildID)) await botcache.db.muted.create(message.guildID, {members: mutedMembers})
            else await botcache.db.muted.update(message.guildID, {members: mutedMembers})
            await addRole(message.guildID, member.id, roleID)
            await message.send("Member successfuly muted!")
            let embed = new Embed()
                .setTitle("A member got muted:")
                .addField("Member", member.tag)
                .addField("Muted by:", message.member?.tag as string)
                .addField("Muted for:", await TimeToString(timeout))
                .setTimestamp()
            await log(embed, guild)
            await sleep(timeout)
            let rolee = guild.roles.get(roleID)
            if (!rolee) {
                let mutedMembers = (await botcache.db.muted.get(message.guildID))?.members
                if (!mutedMembers) mutedMembers = []
                if (!roleID) return await botcache.db.config.update(message.guildID, {muted: undefined})
                mutedMembers.filter(e => e.id != member?.id)
                await botcache.db.muted.update(message.guildID, {members: mutedMembers})
                await removeRole(message.guildID, member.id, roleID)
                let embed = new Embed()
                    .setTitle("A member got unmuted:")
                    .addField("Member", member.tag)
                    .addField("Unmuted by:", "Auto Unmute")
                    .setTimestamp()
                await log(embed, guild)
            } else {
                await botcache.db.muted.delete(member.id)
                await removeRole(message.guildID, member.id, roleID)
                let embed = new Embed()
                    .setTitle("A member got unmuted:")
                    .addField("Member", member.tag)
                    .addField("Unmuted by:", "Auto Unmute")
                    .setTimestamp()
                await log(embed, guild)
            }
        } else {
            await addRole(message.guildID, member.id, roleID)
            let mutedMembers = (await botcache.db.muted.get(message.guildID))?.members
            if (!mutedMembers) mutedMembers = []
            mutedMembers.push({role: roleID, id: member.id})
            if (botcache.db.muted.has(member.id)) await botcache.db.muted.update(guild.id, {members: mutedMembers})
            else botcache.db.muted.create(guild.id, {members: mutedMembers})
            await message.send("Member successfuly muted!")
            let embed = new Embed()
                .setTitle("A member got muted:")
                .addField("Member", member.tag)
                .addField("Muted by:", message.member?.tag as string)
                .setTimestamp()
            await log(embed, guild)
        }
    }
})