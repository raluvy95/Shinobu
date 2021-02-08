import { botHasChannelPermissions } from "../../../deps.ts";
import { botcache } from "../../types/cache.ts";
import { usageEmbed } from "../../utils/embeds.ts";
import { createCommand } from "../../utils/functions.ts";

createCommand({
    name:"logchannel",
    aliases: ["logs"],
    module:"config",
    permission: ["MANAGE_CHANNELS"],
    description: "Set up a logging channel to keep up with your server's events!",
    usage: "set <channel> | remove",
    execute: async (message, args) => {

        if (!args[0]) return message.send({embed: usageEmbed("logs", "set <channel> | remove")})
        if (!message.guild) return
        let option = args.shift()
        switch (option) {
            case "set":
                if (!args[0]) return message.send({embed: usageEmbed("logs", "set <channel>")})
                let channel = message.mentionedChannels[0]
                if (!channel) {
                    channel = message.guild.channels.find(e => e.id == args[0] || e.name == args[0] || e.mention == args[0])
                    if (!channel) return message.send("That's not an available channel.")
                }
                if (!(await botHasChannelPermissions(channel.id, ["SEND_MESSAGES", "EMBED_LINKS"]))) return await message.send("You have to give the bot `send messages` and `embed links` permissions on that channel.")
                if (!botcache.db.config.has(message.guildID)) botcache.db.config.create(message.guildID, {logs: channel.id, id: message.guildID})
                else await botcache.db.config.update(message.guildID, {logs: channel.id})
                
                await message.send("Successfuly set the log channel!")
                break
            case "remove":
                if (!botcache.db.config.has(message.guildID)) return message.send("The log channel isn't set.")
                else await botcache.db.config.update(message.guildID, {logs: undefined})
                await message.send("Successfuly removed the log channel.")
                break
            default:
                await message.send({embed: usageEmbed("logs", "set <channel> | remove")})
                break
        }
    }
})