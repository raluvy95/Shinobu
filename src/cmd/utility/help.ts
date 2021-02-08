import { Embed } from "../../types/embed.ts"
import { botcache } from "../../types/cache.ts"
import { createCommand } from "../../utils/functions.ts"
import { helpPaginator } from "../../utils/helpPaginator.ts";
import { TimeToString } from "../../utils/time.ts";

createCommand({
    name:"help",
    module:"utility",
    usage: "[command]",
    description:"Sends the bot's commands / Shows information about a command",
    execute: async (message, args) => {
        if (args[0]) {
            let command = botcache.commands.find(e => e.name == args.join(" "))
            if (!command) return await message.send("That's not a valid command.")
            else if (command.module == "owner") return await message.send("That's not a valid command.")
            let name = command.name
            let description = command.description ? command.description : "No description."
            let permission = command.permission ? command.permission.join(", ").toLowerCase().replace(/_/g, " ").replace(/guild/g, "server") : "No permissions needed to use this command."
            let cooldown: number | string = command.cooldown ? command.cooldown : 0
            cooldown = await TimeToString(cooldown)
            let nsfw = command.nsfwOnly ? "This command is nsfw." : "This command is not nsfw."
            let aliases = command.aliases ? command.aliases.join(", ") : "This command has no aliases"
            let embed = new Embed()
                .setTitle(`${name} command info:`)
                .setDescription(`${description}\n**[] is for optional arguments.**\n**<> is for needed arguments.**\n**"|" means "or"`)

            if (command.usage) 
                embed.addField("Usage:", `${command.usage}`)

            embed.addField("Permissions needed to use this command:", permission)
                 .addField("command cooldown:", `${cooldown ? cooldown : "No cooldown."}`)
                 .addField("Is this command nsfw:", nsfw)
                 .addField("Command aliases:", aliases)
                 .setColor("#0037fa")
            return await message.send({embed})
        }
        await helpPaginator(message)
    }
})