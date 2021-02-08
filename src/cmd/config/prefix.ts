import { botcache } from "../../types/cache.ts";
import { usageEmbed } from "../../utils/embeds.ts";
import { createCommand } from "../../utils/functions.ts";
import { settings } from "../../../settings.ts"

createCommand({
    name:"prefix",
    module:"config",
    permission: ["MANAGE_GUILD"],
    description: "Change the prefix to your prefernce!",
    usage: "set <prefix> | default",
    execute: async (message, args) => {
        if (!args[0]) return await message.send({embed: usageEmbed("prefix set <prefix> | default")})
        let option = args.shift()
        if (!message.guild) return
        switch (option) {
            case "set":
                if (!args[0]) return await message.send({embed: usageEmbed("prefix set <prefix>")})
                let prefix = args[0]
                if (prefix.length > 5) return await message.send("The prefix' length should be lower than 5.")
                if (!await botcache.db.config.has(message.guildID)) await botcache.db.config.create(message.guildID, {prefix, logs: "", muted: ""})
                else await botcache.db.config.update(message.guildID, {prefix})
                await message.send({content: `Successfuly set the prefix to ${prefix}`, mentions: {parse: []}})
                break
            case "default":
                await botcache.db.config.update(message.guildID, {prefix: "."})
                await message.send({content: `Successfuly set the prefix to ${settings.defaultPrefix}`, mentions: {parse: []}})
                break
            default:
                await message.send({embed: usageEmbed("prefix set <prefix> | default")})
                break
        }
    }
})