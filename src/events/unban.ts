import { botID, botHasPermission } from "../../deps.ts";
import { botcache } from "../types/cache.ts";
import { Embed } from "../types/embed.ts";
import { log } from "../utils/functions.ts";

botcache.eventHandlers.guildBanRemove = async (guild) => {
    if (!(await botHasPermission(guild.id, ["VIEW_AUDIT_LOG"]))) return
    let logs = await guild.auditLogs({action_type: "MEMBER_BAN_REMOVE", limit: 1}) as any
    if (logs) {
        let entry = logs.audit_log_entries[0]
        if (!entry) return
        if (logs.users[1].id == botID) return
        let embed = new Embed()
            .setTitle("A member got unbanned:")
            .addField("Member:", `${logs.users[1].username}#${logs.users[1].discriminator}`)
            .addField("Unbanned by:", `${logs.users[0].username}#${logs.users[0].discriminator}`)
            .setTimestamp()
        await log(embed, guild)
    }
}