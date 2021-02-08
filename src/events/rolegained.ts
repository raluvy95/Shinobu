
import { botID, botHasPermission } from "../../deps.ts";
import { botcache } from "../types/cache.ts";
import { Embed } from "../types/embed.ts";
import { log } from "../utils/functions.ts";

botcache.eventHandlers.roleGained = async (guild, member, roleID) => {
    if (!(await botHasPermission(guild.id, ["VIEW_AUDIT_LOG"]))) return
    let logs = await guild.auditLogs({action_type: "MEMBER_ROLE_UPDATE", limit: 1}) as any
    if (logs) {
        let entry = logs.audit_log_entries[0]
        if (!entry) return
        if (!entry.changes.find((e: any) => e.key == "$add")) return
        if (entry.changes.find((e: any) => e.key == "$add").new_value[0].id != roleID) return
        let executor = logs.users[1] ? logs.users[1] : logs.users[0]
        if (executor.id == botID) return
        let memba = guild.members.get(entry.user_id)
        let embed = new Embed()
            .setTitle("A role has been added to a member:")
            .addField("Member:", member.tag)
            .addField("Added by:", memba?.tag as string)
            .addField("Role:", `<@&${roleID}>`)
            .setTimestamp()
        await log(embed, guild)
    }
}