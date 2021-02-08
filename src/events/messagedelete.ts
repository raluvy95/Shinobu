import { botcache } from "../types/cache.ts";
import { Embed } from "../types/embed.ts";
import { log } from "../utils/functions.ts";

botcache.eventHandlers.messageDelete = async (_, message) => {
    if (!message || !message.content || !message.member || !message.channel || !message.guild) return
    let embed = new Embed()
        .setTitle("A message got deleted:")
        .addField("Message Author:", message.member.tag)
        .addField("Message Content:", message.content)
        .addField("Channel:", message.channel.mention as string)
        .setTimestamp()
    await log(embed, message.guild)
}