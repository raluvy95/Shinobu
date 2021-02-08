import { highestRole, botHasChannelPermissions, botID } from "../../../deps.ts";
import { botcache } from "../../types/cache.ts";
import { usageEmbed } from "../../utils/embeds.ts";
import { Embed } from "../../types/embed.ts";
import { createCommand } from "../../utils/functions.ts";

createCommand({
    name:"welcome",
    module:"config",
    permission: ["MANAGE_GUILD"],
    description: "Set the welcome configurations that trigger when someone joins!",
    usage: "channel <channel | remove> | role <role | remove> | message <message | remove> | variables | remove",
    execute: async (message, args) => {
        if (!args[0]) return await message.send({embed: usageEmbed("welcome", "channel <channel | remove> | role <role | remove> | message <message | remove> | remove")})
        if (!message.guild) return
        let option = args.shift()
        switch (option) {
            case "channel":
                if (!args[0]) return await message.send({embed: usageEmbed("welcome", "channel <channel | remove>")})
                if (args[0] == "remove") {
                    let keklol = (await botcache.db.welcome.get(message.guildID))?.channel
                    if (!keklol) return await message.send("The welcome message wasn't set.")
                    else await botcache.db.welcome.update(message.guild.id, {channel: undefined})
                    return await message.send("Successfuly removed the welcome channel.")
                }
                let channel = message.mentionedChannels[0]
                if (!channel) {
                    channel = message.guild.channels.find(e => e.id == args[0] || e.name == args[0] || e.mention == args[0])
                    if (!channel) return await message.send("That's not an available channel.")
                }
                if (!(await botHasChannelPermissions(channel.id, ["SEND_MESSAGES"]))) return await message.send("You have to give the bot `send messages` permission on that channel.")
                if (!botcache.db.welcome.has(message.guildID)) botcache.db.welcome.create(message.guildID, {channel: channel.id, id: message.guildID})
                else await botcache.db.welcome.update(message.guildID, {channel: channel.id})
                await message.send("Successfuly set the welcome channel!")
                break
            case "role":
                if (!args[0]) return await message.send({embed: usageEmbed("welcome", "role <role | remove>")})
                if (args[0] == "remove") {
                    let keklol = (await botcache.db.welcome.get(message.guildID))?.role
                    if (!keklol) return await message.send("The welcome message wasn't set.")
                    else await botcache.db.welcome.update(message.guild.id, {role: undefined})
                    return await message.send("Successfuly removed the welcome role.")
                }
                let role = message.mentionedRoles[0]
                if (!role) {
                    role = message.guild.roles.find(e => e.id == args[0] || e.name == args[0] || e.mention == args[0])
                    if (!role) return await message.send("That's not an available role.")
                }
                if ((await highestRole(message.guildID, message.author.id))?.position as number < role.position) return await message.send("I can't set that role since it's higher than you!")
                if ((await highestRole(message.guildID, botID))?.position as number < role.position) return await message.send("My role isn't high enough!")
                if (!botcache.db.welcome.has(message.guildID)) botcache.db.welcome.create(message.guildID, {channel: role.id,id: message.guildID})
                else await botcache.db.welcome.update(message.guildID, {role: role.id})
                await message.send("Successfuly set the welcome role!")
                break
            case "message":
                if (!args[0]) return message.send({embed: usageEmbed("welcome", "message <message | remove>")})
                if (args[0] == "remove") {
                    let keklol = (await botcache.db.welcome.get(message.guildID))?.message
                    if (!keklol) return await message.send("The welcome message wasn't set.")
                    else await botcache.db.welcome.update(message.guild.id, {message: undefined})
                    return await message.send("Successfuly removed the welcome message.")
                }
                let msg = args.join(" ")
                if (!msg) return await message.send("You have to specify a message to send.")
                if (!botcache.db.welcome.has(message.guildID)) botcache.db.welcome.create(message.guildID, {message: msg, id: message.guildID})
                else await botcache.db.welcome.update(message.guildID, {message: msg})
                await message.send(`Successfuly set the welcome message!`)
                break
            case "variables":
                let smth = "{guild}: shows the server's name.\n{server}: shows the server's name.\n{count}: shows the server's new member count.\n{member}: shows the new member's username.\n{tag}: show's the new member's tag.\n{mention}: pings the new member."
                let embed = new Embed()
                    .setTitle("Welcome message's variables:")
                    .setDescription(smth)
                    .setTimestamp()
                await message.send({embed})
                break
            case "remove":
                if (!botcache.db.welcome.has(message.guildID)) return message.send("You haven't configured the welcome settings yet.")
                else botcache.db.welcome.delete(message.guildID)
                await message.send("Successfuly removed the welcome configurations.")
                break
            default:
                await message.send({embed: usageEmbed("welcome", "channel <channel | remove> | role <role | remove> | message <message | remove> | variable | remove")})
                break
        }
    }
})