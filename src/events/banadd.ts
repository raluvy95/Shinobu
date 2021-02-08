import { botcache } from "../types/cache.ts";
import { Embed } from "../types/embed.ts";
import { botID, botHasPermission } from "../../deps.ts";
import { log } from "../utils/functions.ts";

botcache.eventHandlers.guildBanAdd = async (guild) => {
    if (!(await botHasPermission(guild.id, ["VIEW_AUDIT_LOG"]))) return
    let audit = await guild.auditLogs({action_type: "MEMBER_BAN_ADD", limit: 1}) as any
    if (audit) {
        if (audit.audit_log_entries != botID) {
            let embed = new Embed()
                .setTitle("A member got banned:")
                .addField("Banned by:", `${audit.users[0].username}#${audit.users[0].discriminator}`)
                .addField("Banned member:", `${audit.users[1].username}#${audit.users[1].discriminator}`)
                .addField("Reason:", audit.audit_log_entries.reason ? audit.audit_log_entries.reason : "No reason.")
                .setTimestamp()
            await log(embed, guild)
        }
    }
}