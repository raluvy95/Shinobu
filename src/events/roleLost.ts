import { botID, botHasPermission } from "../../deps.ts";
import { botcache } from "../types/cache.ts";
import { Embed } from "../types/embed.ts";
import { log } from "../utils/functions.ts";

botcache.eventHandlers.roleLost = async (guild, member, roleID) => {
    if (!(await botHasPermission(guild.id, ["VIEW_AUDIT_LOG"]))) return
    let logs = await guild.auditLogs({action_type: "MEMBER_ROLE_UPDATE", limit: 1}) as any
    if (logs) {
        let entry = logs.audit_log_entries[0]
        if (!entry) return
        if (!entry.changes.find((e: any) => e.key == "$remove")) return
        if (entry.changes.find((e: any) => e.key == "$remove").new_value[0].id != roleID) return
        let executor = logs.users[1] ? logs.users[1] : logs.users[0]
        if (executor.id == botID) return
        let memba = guild.members.get(entry.user_id)
        let embed = new Embed()
            .setTitle("A role has been removed from a member:")
            .addField("Member:", member.tag)
            .addField("Removed by:", memba?.tag as string)
            .addField("Role:", `<@&${roleID}>`)
            .setTimestamp()
        await log(embed, guild)
    }
}