import { botcache } from "../types/cache.ts";

botcache.eventHandlers.roleDelete = async (guild, role) => {
    if (botcache.db.welcome.has(guild.id)) {
        let welcome = await botcache.db.welcome.get(guild.id)
        if (!welcome) return
        if (welcome.role === role.id) await botcache.db.welcome.update(guild.id, {role: undefined})
    }
    if (botcache.db.config.has(guild.id)) {
        let config = await botcache.db.config.get(guild.id)
        if (!config) return
        if (config.muted === role.id) await botcache.db.config.update(guild.id, {muted: undefined})
    }
    if (botcache.db.muted.has(guild.id)) {
        let muted = await botcache.db.muted.get(guild.id)
        if (!muted) return
        let members = muted.members.filter(e => e.role != role.id)
        await botcache.db.muted.update(guild.id, {members})
    }
}