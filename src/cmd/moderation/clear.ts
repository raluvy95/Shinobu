import { deleteMessages, getMessages, botHasPermission } from "../../../deps.ts";
import { createCommand, log } from "../../utils/functions.ts";
import { Embed } from "../../types/embed.ts";
import { usageEmbed } from "../../utils/embeds.ts";

createCommand({
    name:"clear",
    aliases: ["purge"],
    module: "moderation",
    usage: "<amount>",
    description: "Clear a certain amount of messages in a channel.",
    permission: ["MANAGE_MESSAGES"],
    execute: async (message, args, guild) => {
        if (!args[0]) return await message.send({embed:usageEmbed("clear", "<amount>")})
        if (isNaN(args[0] as any)) return await message.send("The amount has to be a number.")
        if (parseInt(args[0]) > 100) return await message.send("The amount has to be lower than 100")
        if (parseInt(args[0]) <= 0) return await message.send("The amount has to be bigger than 0.")
        let messages = (await getMessages(message.channelID, {limit: parseInt(args[0])}))?.filter(e => e.timestamp > 604800000)
        if (messages?.length == 0) return await message.send("There are no messages to delete.")
        if (!(await botHasPermission(message.guildID, ["MANAGE_MESSAGES"]))) return await message.send("I don't have enough permissions to clear this chat.")
        await message.delete()
        await deleteMessages(message.channelID, messages?.map(e => e.id) as string[])
        let msg = await message.send(`Successfuly cleared ${args[0]} messages.`)
        await msg.delete("", 5000)
        let embed = new Embed()
            .setTitle("A channel got cleared:")
            .addField("Cleared by:", message.member?.tag as string)
            .addField("Amount of messages cleared:", `${messages?.length} messages`)
            .setTimestamp()
        await log(embed, guild)
    }
})