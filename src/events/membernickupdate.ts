
import { botID, botHasPermission } from "../../deps.ts";
import { botcache } from "../types/cache.ts";
import { Embed } from "../types/embed.ts";
import { log } from "../utils/functions.ts";

botcache.eventHandlers.nicknameUpdate = async (guild, member, newn, oldn) => {
    if (!(await botHasPermission(guild.id, ["VIEW_AUDIT_LOG"]))) return
    let logs = await guild.auditLogs({action_type: "MEMBER_UPDATE", limit: 1}) as any
    if (logs) {
        if (!logs.audit_log_entries[0]) return
        let changes = logs.audit_log_entries[0].changes.find((e: any) => e.key == "nick")
        if (!changes) return
        let executor = logs.users[1] ? logs.users[0] : logs.users[0];
        if (executor.id == botID) return
        if ((oldn ? oldn : member.username) == (newn ? newn : member.username)) return
        let embed = new Embed()
            .setTitle("A member's nickname got changed:")
            .addField("Member:", `${member.tag}`)
            .addField("Changed by:", `${executor.username}#${executor.discriminator}`)
            .addField("Old nickname:", oldn ? oldn : member.username)
            .addField("New nickname:", newn ? newn : member.username)
            .setTimestamp()
        await log(embed, guild)
    }
}


