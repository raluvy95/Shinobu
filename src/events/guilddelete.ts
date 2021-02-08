import { botcache } from "../types/cache.ts";

botcache.eventHandlers.guildDelete = (guild) => {
    if (botcache.db.config.has(guild.id)) botcache.db.config.delete(guild.id)
    if (botcache.db.welcome.has(guild.id)) botcache.db.welcome.delete(guild.id)
    if (botcache.db.goodbye.has(guild.id)) botcache.db.goodbye.delete(guild.id)
    if (botcache.db.muted.has(guild.id)) botcache.db.muted.delete(guild.id)
    if (botcache.db.remind.has(guild.id)) botcache.db.remind.delete(guild.id)
}