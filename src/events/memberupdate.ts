import { botcache } from "../types/cache.ts";
import { addRole, sleep, removeRole, botHasPermission } from "../../deps.ts";

botcache.eventHandlers.guildMemberUpdate = async (guild, member, _) => {
    if (!(await botHasPermission(guild.id, ["MANAGE_ROLES"]))) return
    if (!botcache.db.config.has(guild.id)) return
    if (!botcache.db.muted.has(guild.id)) return
    let smth = await botcache.db.muted.get(guild.id)
    if (!smth) return
    let members = smth.members
    let mutedMember = members.find(e => e.id == member.id)
    if (!mutedMember) return
    let roleID = mutedMember.role
    if (!roleID) return
    let role = guild.roles.find(e => e.id == roleID)
    if (!role) {
      if (!botcache.db.config.has(guild.id)) return
      let config = await botcache.db.config.get(guild.id)
      if (!config) return
      roleID = config.muted as string
      if (!roleID) return
      if (!guild.roles.get(roleID)) await botcache.db.config.update(guild.id, {muted: undefined}) // query("UPDATE config SET muted = NULL WHERE guild = ?", [guild.id])
      else {
        let kek = members.filter(e => e.id != member.id)
        mutedMember.role = roleID
        kek.push(mutedMember)
        await botcache.db.muted.update(guild.id, {members: kek})
      }
    }
    if (!member.guildMember(guild.id)?.roles.includes(roleID)) {
      let unmute = mutedMember.unmute
      if (!unmute) {
        await addRole(guild.id, member.id, roleID)
        return
      }
      if (unmute <= Date.now()) {
        let mutedMembers = members.filter(e => e.id != member.id)
        await botcache.db.muted.update(guild.id, {members: mutedMembers})
        return
      }
      else {
        await addRole(guild.id, member.id, roleID)
        await sleep(unmute - Date.now())
        let mutedMembers = members.filter(e => e.id != member.id)
        await botcache.db.muted.update(guild.id, {members: mutedMembers})
        await removeRole(guild.id, member.id, roleID)
      }
    } else {
      let unmute = mutedMember.unmute
      if (!unmute) {
        await addRole(guild.id, member.id, roleID)
        return
      }
      if (unmute <= Date.now()) {
        await removeRole(guild.id, member.id, roleID)
        let mutedMembers = members.filter(e => e.id != member.id)
        await botcache.db.muted.update(guild.id, {members: mutedMembers})
        return
      }
      else {
        await sleep(unmute - Date.now())
        let mutedMembers = members.filter(e => e.id != member.id)
        await botcache.db.muted.update(guild.id, {members: mutedMembers})
        await removeRole(guild.id, member.id, roleID)
      }
    }
}
