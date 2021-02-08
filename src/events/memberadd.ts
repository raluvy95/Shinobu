import { botcache } from "../types/cache.ts";
import { addRole, removeRole, sleep, getUser, botHasPermission } from "../../deps.ts"
import { log } from "../utils/functions.ts";
import { Embed } from "../types/embed.ts";

botcache.eventHandlers.guildMemberAdd = async (guild, member) => {
  if (botcache.db.welcome.has(guild.id)) {
    let welcome = await botcache.db.welcome.get(guild.id)
    if (welcome) {
        if (welcome.role) {
          
          let role = guild.roles.get(welcome.role)
          if (!role) await botcache.db.welcome.update(guild.id, {role: undefined})
          else {
            if (await botHasPermission(guild.id, ["MANAGE_ROLES"]))
              await addRole(guild.id, member.id, role.id)
          }
        }
        let channelID = welcome.channel
        if (!channelID) return
        let channel = guild.channels.get(channelID)
        let msg = welcome.message
        if (channelID && !channel) {
            await botcache.db.welcome.update(guild.id, {channel: undefined})
        } else if (channel && msg) {
            let message = msg.replace(/{member}/g, member.username).replace(/{count}/g, `${guild.memberCount}`).replace(/{tag}/g, `${member.tag}`).replace(/{server}/g, guild.name).replace(/{guild}/g, guild.name).replace(/{mention}/, member.mention)
            await channel.send({content: message, mentions: {parse: []}})
        }
    }
}
      if (!botcache.db.config.has(guild.id) || !botcache.db.muted.has(guild.id)) return

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
        if (!guild.roles.get(roleID)) await botcache.db.config.update(guild.id, {muted: undefined})
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
          let embed = new Embed()
          .setTitle("A member got unmuted:")
          .addField("Member:", `${(await getUser(member.id)).username}#${(await getUser(member.id)).discriminator}`)
          .addField("Unmuted by:", "Auto unmute.")
          .setTimestamp()
          await log(embed, guild)
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
          let embed = new Embed()
          .setTitle("A member got unmuted:")
          .addField("Member:", `${(await getUser(member.id)).username}#${(await getUser(member.id)).discriminator}`)
          .addField("Unmuted by:", "Auto unmute.")
          .setTimestamp()
          await log(embed, guild)
          return
        }
        else {
          await sleep(unmute - Date.now())
          let mutedMembers = members.filter(e => e.id != member.id)
          await botcache.db.muted.update(guild.id, {members: mutedMembers})
          await removeRole(guild.id, member.id, roleID)
          let embed = new Embed()
          .setTitle("A member got unmuted:")
          .addField("Member:", `${(await getUser(member.id)).username}#${(await getUser(member.id)).discriminator}`)
          .addField("Unmuted by:", "Auto unmute.")
          .setTimestamp()
          await log(embed, guild)
        }
      }
}