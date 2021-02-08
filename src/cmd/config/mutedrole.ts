import { highestRole, botHasPermission, calculatePermissions, botID } from "../../../deps.ts";
import { botcache } from "../../types/cache.ts";
import { usageEmbed } from "../../utils/embeds.ts";
import { createCommand } from "../../utils/functions.ts";

createCommand({
    name:"mutedrole",
    module:"config",
    permission: ["MANAGE_ROLES"],
    description: "Set up the muted role so you can start muting members!",
    usage: "set <role> | remove",
    execute: async (message, args, guild) => {
        
        if (!args[0]) return await message.send({embed: usageEmbed("mutedrole set <role> | remove")})
        let option = args.shift()
        switch (option) {
            case "set":
                if (!args[0]) return await message.send({embed: usageEmbed("mutedrole", "set <role>")})
                let role = message.mentionedRoles[0]
                if (!role) {
                    role = guild.roles.find(e => e.id == args[0] || e.name == args[0] || e.mention == args[0])
                    if (!role) return await message.send("That's not an available role.")
                }
                let permissions = calculatePermissions(BigInt(role.permissions))
                if (permissions.includes("SEND_MESSAGES")) return await message.send("You have to remove the send messages` permission from the muted role.")
                if (!(await botHasPermission(message.guildID, ["MANAGE_ROLES"]))) return await message.send("You have to give the bot `manage roles` permission.")
                if ((await highestRole(message.guildID, message.author.id))?.position as number < role.position) return await message.send("I can't set that role since it's higher than you!")
                if ((await highestRole(message.guildID, botID))?.position as number < role.position) return await message.send("My role isn't high enough!")
                if (!await botcache.db.config.has(message.guildID)) await botcache.db.config.create(message.guildID, {muted: role.id, logs: "", prefix: "."})
                else await botcache.db.config.update(message.guildID, {muted: role.id})
                await message.send("Successfuly set the muted role!")
                break
            case "remove":
                if (!await botcache.db.config.has(message.guildID)) return await message.send("The log channel isn't set.")
                else await botcache.db.config.update(message.guildID, {muted: undefined})
                await message.send("Successfuly removed the muted role.")
                break
            default:
                await message.send({embed: usageEmbed("mutedrole", "set <role> | remove")})
                break
        }
    }
})