import { botHasPermission, createWebhook, executeWebhook, rawAvatarURL } from "../../../deps.ts";
import { createCommand } from "../../utils/functions.ts";
import { usageEmbed } from "../../utils/embeds.ts";

createCommand({
    name:"clone",
    module:"fun",
    usage: "<message>",
    description: "Send a message using a webhook.",
    cooldown: 10,
    execute: async (message, args) => {
        if (!args[0]) return await message.send({embed: usageEmbed("clone <message>")})
        if (!(await botHasPermission(message.guildID, ["MANAGE_WEBHOOKS"]))) return await message.send("I don't have permissions to execute this command.")
        let webhook = await createWebhook(message.channelID, {name: message.author.username, avatar: rawAvatarURL(message.author.id, `${message.author.username}#${message.author.discriminator}`)})
        if (!webhook.token) return await message.send("Something went wrong while creating the webhook.")
        if (await botHasPermission(message.guildID, ["MANAGE_MESSAGES"])) await message.delete(message.id)
        await executeWebhook(webhook.id, webhook.token, {content: args.join(" "), mentions: {parse: []}})
    }
})