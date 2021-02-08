import { botcache } from "../types/cache.ts";
import { Embed } from "../types/embed.ts";
import { log } from "../utils/functions.ts";

botcache.eventHandlers.messageUpdate = async (message, cachedMessage) => {
    if (!message.guild) return
    if (!cachedMessage.content) return
    if (message.content == cachedMessage.content) return
    let embed = new Embed()
        .setTitle("A message got edited:")
        .addField("Message Author:", `${message.member?.tag}`)
        .addField("Old Content:", cachedMessage.content)
        .addField("New Content:", message.content)
        .addField("Channel:", message.channel?.mention as string)
        .setTimestamp()
    await log(embed, message.guild)
}