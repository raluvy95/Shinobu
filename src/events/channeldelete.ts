import { botcache } from "../types/cache.ts";

botcache.eventHandlers.channelDelete = async (channel) => {
    let guild = channel.guild
    if (guild) {
        if (botcache.db.config.has(guild.id)) {
            let config = await botcache.db.config.get(guild.id)
            if (!config) return
            if (config.logs == channel.id) await botcache.db.config.update(guild.id, {logs: undefined})
        }
        if (botcache.db.goodbye.has(guild.id)) {
            let goodbye = await botcache.db.goodbye.get(guild.id)
            if (!goodbye) return
            if (goodbye.channel == channel.id) await botcache.db.goodbye.update(guild.id, {channel: undefined})
        }
        if (botcache.db.welcome.has(guild.id)) {
            let welcome = await botcache.db.welcome.get(guild.id)
            if (!welcome) return
            if (welcome.channel == channel.id) await botcache.db.welcome.update(guild.id, {channel: undefined})
        }
        if (botcache.db.remind.has(guild.id)) {
            let remind = await botcache.db.remind.get(guild.id)
            if (!remind) return
            let members = remind.members.filter(e => e.channel != channel.id)
            await botcache.db.remind.update(guild.id, {members})
        }
    }
}