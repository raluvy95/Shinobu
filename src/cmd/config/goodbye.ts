import { botHasChannelPermissions } from "../../../deps.ts";
import { botcache } from "../../types/cache.ts";
import { usageEmbed } from "../../utils/embeds.ts";
import { Embed } from "../../types/embed.ts";
import { createCommand } from "../../utils/functions.ts";

createCommand({
    name:"goodbye",
    module:"config",
    permission: ["MANAGE_GUILD"],
    description: "Set the goodbye configurations that trigger when someone leaves!",
    usage: "channel <channel | remove> | message <message | remove> | variables |remove",
    execute: async (message, args) => {

        if (!args[0]) return await message.send({embed: usageEmbed("goodbye", "channel <channel | remove> | role <role | remove> | message <message | remove> | remove")})
        if (!message.guild) return
        let option = args.shift()
        switch (option) {
            case "channel":
                if (!args[0]) return await message.send({embed: usageEmbed("goodbye", "channel <channel | remove>")})
                if (args[0] == "remove") {
                    let keklol = (await botcache.db.goodbye.get(message.guildID))?.channel
                    if (!keklol) return await message.send("The goodbye channel wasn't set.")
                    else await botcache.db.goodbye.update(message.guild.id, {channel: undefined})
                    return await message.send("Successfuly removed the goodbye channel.")
                }
                let channel = message.mentionedChannels[0]
                if (!channel) {
                    channel = message.guild.channels.find(e => e.id == args[0] || e.name == args[0] || e.mention == args[0])
                    if (!channel) return await message.send("That's not an available channel.")
                }
                if (!(await botHasChannelPermissions(channel.id, ["SEND_MESSAGES"]))) return await message.send("You have to give the bot `send messages` permission on that channel.")
                if (!await botcache.db.goodbye.has(message.guildID)) await botcache.db.goodbye.create(message.guildID, {channel: channel.id, message: ""})
                else await botcache.db.goodbye.update(message.guildID, {channel: channel.id})
                await message.send("Successfuly set the goodbye channel!")
                break
            case "message":
                if (!args[0]) return message.send({embed: usageEmbed("goodbye", "message <message | remove>")})
                if (args[0] == "remove") {
                    let keklol = (await botcache.db.goodbye.get(message.guildID))?.message
                    if (!keklol) return await message.send("The goodbye message wasn't set.")
                    else await botcache.db.goodbye.update(message.guild.id, {message: undefined})
                    return await message.send("Successfuly removed the goodbye message.")
                }
                let msg = args.join(" ")
                if (!msg) return await message.send("You have to specify a message to send.")
                if (!await botcache.db.goodbye.has(message.guildID)) await botcache.db.goodbye.create(message.guildID, {message: msg, channel: ""})
                else await botcache.db.goodbye.update(message.guildID, {message: msg})
                await message.send(`Successfuly set the goodbye message!`)
                break
            case "variables":
                let smth = "{guild}: shows the server's name.\n{server}: shows the server's name.\n{count}: shows the server's new member count.\n{member}: shows the new member's username.\n{tag}: show's the new member's tag."
                let embed = new Embed()
                    .setTitle("Goodbye message's variables:")
                    .setDescription(smth)
                    .setTimestamp()
                await message.send({embed})
                break
            case "remove":
                if (!await botcache.db.goodbye.has(message.guildID)) return await message.send("You haven't configured the goodbye settings yet.")
                else await botcache.db.goodbye.delete(message.guildID)
                await message.send("Successfuly removed the goodbye configurations.")
                break
            default:
                await message.send({embed: usageEmbed("goodbye", "channel <channel | remove> | message <message | remove> | remove")})
                break
        }
    }
})