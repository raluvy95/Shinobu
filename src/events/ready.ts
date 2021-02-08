
import { getUser, botHasPermission, getMessages, editBotsStatus, cache, StatusTypes, botID, ActivityType, addRole, removeRole, sleep } from "../../deps.ts";
import { botcache } from "../types/cache.ts";
import { muted, config, welcome, goodbye } from "../types/schemas.ts";
import { Embed } from "../types/embed.ts";
import { log } from "../utils/functions.ts";

botcache.eventHandlers.ready = async () => {
    if (botcache.ready) return
    else botcache.ready = true
    botcache.readyAt = Date.now()
    if (!botcache.db.sabr.hasTable("muted")) {
      await botcache.db.sabr.createTable<muted>("muted")
    }
    if (!botcache.db.sabr.hasTable("config")) {
      await botcache.db.sabr.createTable<config>("config")
    }
    if (!botcache.db.sabr.hasTable("welcome")) {
      await botcache.db.sabr.createTable<welcome>("welcome")
    }
    if (!botcache.db.sabr.hasTable("goodbye")) {
      await botcache.db.sabr.createTable<goodbye>("goodbye")
    }
    let botUser = await getUser(botID)
    
    console.log(`Successfully connected as ${botUser.username}#${botUser.discriminator} with id ${botID}`)
    let guildCount = cache.guilds.size
    let userCount = cache.members.size
    try {editBotsStatus(StatusTypes.DoNotDisturb, `with ${userCount} users inside ${guildCount} servers`, ActivityType.Game)} catch {}
    setInterval(async () => {
      let guildCount = cache.guilds.size
      let userCount = cache.members.size
      try {editBotsStatus(StatusTypes.DoNotDisturb, `with ${userCount} users inside ${guildCount} servers`, ActivityType.Game)} catch {}
    }, 15000)
    let remindLel = await botcache.db.remind.getAll(true)
    for (let lol of remindLel) {
      let guild = cache.guilds.has(lol.id)
      if (guild) {
        if (!(await botHasPermission(lol.id, ["MANAGE_ROLES"]))) return
        for await (let remindMember of lol.members) {
          let ch = cache.channels.get(remindMember.channel)
          if (ch) {
            let fuckoff = remindMember.remind
            let msg = (await getMessages(ch.id))?.find(e => e.id == remindMember.message)
            if (!msg) {
              if (fuckoff < Date.now()) {
                let members = lol.members.filter(e => e.id != remindMember.id)
                await botcache.db.remind.update(lol.id, {members})
                await ch.send({content: `<@${remindMember.id}> It's time to remind you for: ${remindMember.reason}`, mentions: {parse: ["users"]}})
              } else {
                await sleep(fuckoff - Date.now())
                let members = lol.members.filter(e => e.id != remindMember.id)
                await botcache.db.remind.update(lol.id, {members})
                await ch.send({content: `<@${remindMember.id}> It's time to remind you for: ${remindMember.reason}`, mentions: {parse: ["users"]}})
              }
            } else {
              if (fuckoff < Date.now()) {
                let members = lol.members.filter(e => e.id != remindMember.id)
                await botcache.db.remind.update(lol.id, {members})
                await msg.reply({content: `<@${remindMember.id}> It's time to remind you for: ${remindMember.reason}`, mentions: {parse: ["users"]}})
              } else {
                await sleep(fuckoff - Date.now())
                let members = lol.members.filter(e => e.id != remindMember.id)
                await botcache.db.remind.update(lol.id, {members})
                await msg.reply({content: `<@${remindMember.id}> It's time to remind you for: ${remindMember.reason}`, mentions: {parse: ["users"]}})
              }
            }
          } else {
            let members = lol.members.filter(e => e.id != remindMember.id)
            await botcache.db.remind.update(lol.id, {members})
          }
        }
      }
    }
    for await (let guild of cache.guilds.map(e => e)) {
      if (!botcache.db.muted.has(guild.id)) continue
      let mutedDB = await botcache.db.muted.get(guild.id)
      if (!mutedDB) continue
      for (let member of mutedDB.members) {
        let roleID: string | undefined = member.role
        if (!roleID) continue
        let role = guild.roles.find(e => e.id == roleID)
        if (!role) {
          if (!botcache.db.config.has(guild.id)) continue
          roleID = (await botcache.db.config.get(guild.id))?.muted
          if (!roleID) return
          if (!guild.roles.get(roleID)) {
            await botcache.db.config.update(guild.id, {logs: undefined})
            continue
          }
          else {
            let mutedMembers = mutedDB.members.filter(e => e.id != member.id)
            let mutedMember = member
            mutedMember.role = roleID 
            mutedMembers.push(mutedMember)             
            await botcache.db.muted.update(guild.id, {members: mutedMembers})
          }
        }
        if (!member.id) return
        let guildMember = guild.members.get(member.id)?.guildMember(guild.id)
        if (!guildMember) return
        if (!guildMember.roles.includes(roleID)) {
          let unmute = member.unmute
          if (!unmute) continue
          if (unmute <= Date.now()){
            let mutedMembers = mutedDB.members.filter(e => e.id != member.id)
            await botcache.db.muted.update(guild.id, {members: mutedMembers})
            let embed = new Embed()
              .setTitle("A member got unmuted:")
              .addField("Member:", `${(await getUser(member.id)).username}#${(await getUser(member.id)).discriminator}`)
              .addField("Unmuted by:", "Auto unmute.")
              .setTimestamp()
            await log(embed, guild)
            continue
          }
          else {
            await addRole(guild.id, member.id, roleID)
            await sleep(unmute - Date.now())
            let mutedMembers = mutedDB.members.filter(e => e.id != member.id)
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
          let unmute = member.unmute
          if (!unmute) continue
          if (unmute <= Date.now()) {
            await removeRole(guild.id, member.id, roleID)
            let mutedMembers = mutedDB.members.filter(e => e.id != member.id)
            await botcache.db.muted.update(guild.id, {members: mutedMembers})
          }
          else {
            await sleep(unmute - Date.now())
            let mutedMembers = mutedDB.members.filter(e => e.id != member.id)
            await botcache.db.muted.update(guild.id, {members: mutedMembers})
            await removeRole(guild.id, member.id, roleID)
          }
        }
      }
    }
    setInterval(async () => {
      for await (let guild of cache.guilds.map(e => e)) {
        if (!botcache.db.muted.has(guild.id)) continue
        let mutedDB = await botcache.db.muted.get(guild.id)
        if (!mutedDB) continue
        for (let member of mutedDB.members) {
          let roleID: string | undefined = member.role
          if (!roleID) continue
          let role = guild.roles.find(e => e.id == roleID)
          if (!role) {
            if (!botcache.db.config.has(guild.id)) continue
            roleID = (await botcache.db.config.get(guild.id))?.muted
            if (!roleID) return
            if (!guild.roles.get(roleID)) {
              await botcache.db.config.update(guild.id, {logs: undefined})
              continue
            }
            else {
              let mutedMembers = mutedDB.members.filter(e => e.id != member.id)
              let mutedMember = member
              mutedMember.role = roleID 
              mutedMembers.push(mutedMember)             
              await botcache.db.muted.update(guild.id, {members: mutedMembers})
            }
          }
          if (!member.id) return
          let guildMember = guild.members.get(member.id)?.guildMember(guild.id)
          if (!guildMember) return
          if (!guildMember.roles.includes(roleID)) {
            let unmute = member.unmute
            if (!unmute) continue
            if (unmute <= Date.now()) {
              let mutedMembers = mutedDB.members.filter(e => e.id != member.id)
              await botcache.db.muted.update(guild.id, {members: mutedMembers})
              continue
            }
            else {
              await addRole(guild.id, member.id, roleID)
              await sleep(unmute - Date.now())
              let mutedMembers = mutedDB.members.filter(e => e.id != member.id)
              await botcache.db.muted.update(guild.id, {members: mutedMembers})
              await removeRole(guild.id, member.id, roleID)
              if (botcache.db.config.has(guild.id)) {
                let config = await botcache.db.config.get(guild.id)
                if (!config) continue
                if (config.logs) {
                  let logsCh = cache.channels.get(config.logs)
                  if (!logsCh) {
                    await botcache.db.config.update(guild.id, {logs: undefined})
                  }
                  let embed = new Embed()
                    .setTitle("A member got unmuted:")
                    .addField("Member:", `${(await getUser(member.id)).username}#${(await getUser(member.id)).discriminator}`)
                    .addField("Unmuted by:", "Auto unmute.")
                    .setTimestamp()
                  await log(embed, guild)
                }
              }
            }
          } else {
            let unmute = member.unmute
            if (!unmute) continue
            if (unmute <= Date.now()) {
              await removeRole(guild.id, member.id, roleID)
              let mutedMembers = mutedDB.members.filter(e => e.id != member.id)
              await botcache.db.muted.update(guild.id, {members: mutedMembers})
              if (botcache.db.config.has(guild.id)) {
                let config = await botcache.db.config.get(guild.id)
                if (!config) continue
                if (config.logs) {
                  let logsCh = cache.channels.get(config.logs)
                  if (!logsCh) {
                    await botcache.db.config.update(guild.id, {logs: undefined})
                  }
                  let embed = new Embed()
                    .setTitle("A member got unmuted:")
                    .addField("Member:", `${(await getUser(member.id)).username}#${(await getUser(member.id)).discriminator}`)
                    .addField("Unmuted by:", "Auto unmute.")
                    .setTimestamp()
                  await log(embed, guild)
                }
              }
            }
            else {
              await sleep(unmute - Date.now())
              let mutedMembers = mutedDB.members.filter(e => e.id != member.id)
              await botcache.db.muted.update(guild.id, {members: mutedMembers})
              await removeRole(guild.id, member.id, roleID)
              if (botcache.db.config.has(guild.id)) {
                let config = await botcache.db.config.get(guild.id)
                if (!config) continue
                if (config.logs) {
                  let logsCh = cache.channels.get(config.logs)
                  if (!logsCh) {
                    await botcache.db.config.update(guild.id, {logs: undefined})
                  }
                  let embed = new Embed()
                    .setTitle("A member got unmuted:")
                    .addField("Member:", `${(await getUser(member.id)).username}#${(await getUser(member.id)).discriminator}`)
                    .addField("Unmuted by:", "Auto unmute.")
                    .setTimestamp()
                  await log(embed, guild)
                }
              }
            }
          }
        }
      }
    }, 60000)
}