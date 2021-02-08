import { settings } from "../../../settings.ts";
import { botcache } from "../../types/cache.ts";
import { usageEmbed } from "../../utils/embeds.ts";
import { Embed } from "../../types/embed.ts";
import { createCommand } from "../../utils/functions.ts";

createCommand({
    name:"configuration",
    module: "config",
    aliases: ["config"],
    description: "Show or reset the server's configurations!",
    usage: "reset | show",
    execute: async (message, args) => {
        if (!args[0]) return await message.send({embed: usageEmbed("config", "reset | show")})
        let option = args.shift()
        switch (option) {
            case "show":
                if (!botcache.db.config.has(message.guildID) && !botcache.db.welcome.has(message.guildID) && !botcache.db.goodbye.has(message.guildID)) {
                    await message.send("There is no configuration set for this server.")
                    break
                }
                let welcome: {channel: string, role: string, message: string};
                let config: {logs: string, muted: string, prefix: string};
                let goodbye: {channel: string, message: string};
                if (botcache.db.welcome.has(message.guildID)) {
                    let welcomeDB = await botcache.db.welcome.get(message.guildID)
                    if (!welcomeDB) break
                    let ch = message.guild?.channels.get(welcomeDB.channel)
                    if (!ch) await botcache.db.welcome.update(message.guildID, {channel: undefined})
                    let role = message.guild?.roles.get(welcomeDB.role)
                    if (!role) await botcache.db.welcome.update(message.guildID, {role: undefined})
                    welcome = {
                        channel: ch ? ch.mention : "No channel set.",
                        role: role ? role.mention : "No role set.",
                        message: welcomeDB.message ? welcomeDB.message : "No message set."
                    }
                } else {
                    welcome = {
                        channel: "No channel set.",
                        role: "No role set.",
                        message: "No message set."
                    }
                }
                if (botcache.db.goodbye.has(message.guildID)) {
                    let goodbyeDB = await botcache.db.goodbye.get(message.guildID)
                    if (!goodbyeDB) break
                    let ch = message.guild?.channels.get(goodbyeDB.channel)
                    if (!ch) await botcache.db.welcome.update(message.guildID, {channel: undefined})
                    goodbye = {
                        channel: ch ? ch.mention : "No channel set.",
                        message: goodbyeDB.message ? goodbyeDB.message : "No message set."
                    }
                } else {
                    goodbye = {
                        channel: "No channel set.",
                        message: "No message set."
                    }
                }
                if (botcache.db.config.has(message.guildID)) {
                    let configDB = await botcache.db.config.get(message.guildID)
                    if (!configDB) break
                    let logs = message.guild?.channels.get(configDB.logs)
                    if (!logs) await botcache.db.config.update(message.guildID, {logs: undefined})
                    let muted = message.guild?.roles.get(configDB.muted)
                    if (!muted) await botcache.db.welcome.update(message.guildID, {role: undefined})
                    let prefix = `${configDB.prefix ? configDB.prefix : settings.defaultPrefix}`
                    config = {
                        logs: logs ? logs.mention : "No channel set.",
                        muted: muted ? muted.mention : "No role set.",
                        prefix
                    }
                } else {
                    config = {
                        logs: "No channel set.",
                        muted: "No role set.",
                        prefix: `${settings.defaultPrefix}`
                    }
                }
                let embed = new Embed()
                    .setTitle(message.guild?.name + " configuration:")
                    .addField("Configuration:", 
`
Logs channel: ${config.logs} 
Muted role: ${config.muted} 
Prefix: ${config.prefix} 
`
                    )
                    .addField("Welcome Configuration:", 
`
Welcome channel: ${welcome.channel} 
Welcome role: ${welcome.role} 
Welcome message: ${welcome.message} 
`
                    )
                    .addField("Goodbye Configuration:", 
`
Goodbye channel: ${goodbye.channel} 
Goodbye message: ${goodbye.message} 
`
                    )


                await message.send({embed})
                break
            
            case "reset":
                if (!botcache.db.config.has(message.guildID) && !botcache.db.welcome.has(message.guildID) && !botcache.db.goodbye.has(message.guildID)) {
                    await message.send("There is no configuration set for this server.")
                    break
                }
                if (botcache.db.welcome.has(message.guildID)) {
                    botcache.db.welcome.delete(message.guildID)
                }
                if (botcache.db.goodbye.has(message.guildID)) {
                    botcache.db.goodbye.delete(message.guildID)
                }
                if (botcache.db.config.has(message.guildID)) {
                    botcache.db.config.delete(message.guildID)
                }
                await message.send("The configuration was successfuly reset.")
                break
            default:
                await message.send({embed: usageEmbed("config", "reset | show")})
                break
        }
    }
})