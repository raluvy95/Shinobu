
import { botID, botHasPermission } from "../../deps.ts";
import { botcache } from "../types/cache.ts";
import { Embed } from "../types/embed.ts";
import { log } from "../utils/functions.ts";

botcache.eventHandlers.guildMemberRemove = async (guild, user, _) => {
    if (await botHasPermission(guild.id, ["VIEW_AUDIT_LOG"]))  {
        let audit = await guild.auditLogs({action_type: "MEMBER_KICK", limit: 1}) as any
    
        if (audit) {
            if (audit.audit_log_entries != botID) {
                if (!audit.users[0]) return
                let embed = new Embed()
                .setTitle("A member got kicked:")
                .addField("Kicked by:", `${audit.users[0].username}#${audit.users[0].discriminator}`)
                .addField("Kicked member:", `${audit.users[1].username}#${audit.users[1].discriminator}`)
                .addField("Reason:", audit.audit_log_entries.reason ? audit.audit_log_entries.reason : "No reason.")
                .setTimestamp()
            await log(embed, guild)
            }
        }
    }
    if (botcache.db.goodbye.has(guild.id)) {
        let goodbye = await botcache.db.goodbye.get(guild.id)
        if (goodbye) {
            let channelID = goodbye.channel
            if (!channelID) return
            let channel = guild.channels.get(channelID)
            let msg = goodbye.message
            if (channelID && !channel) {
                await botcache.db.goodbye.update(guild.id, {channel: undefined})
            } else if (channel && msg) {
                let message = msg.replace(/{member}/g, user.username).replace(/{count}/g, `${guild.memberCount}`).replace(/{tag}/g, `${user.username}#${user.discriminator}`).replace(/{server}/g, guild.name).replace(/{guild}/g, guild.name)
                await channel.send({content: message, mentions: {parse: []}})
            }
        }
    }
}

