import { botHasPermission } from "../../../deps.ts"
import { createCommand } from "../../utils/functions.ts";
import { usageEmbed } from "../../utils/embeds.ts";

createCommand({
    name:"say",
    module:"fun",
    usage: "<message>",
    description:"Make the bot say what you want.",
    execute: async (message, args) => {
        if (!args[0]) return await message.send({embed: usageEmbed("say <message>")})
        if (await botHasPermission(message.guildID, ["MANAGE_MESSAGES"])) await message.delete()
        await message.send({content: `${args.join(" ")}

                 -With love, ${message.author.username}#${message.author.discriminator}`, mentions: {parse: []}})
    }
})