import { Embed } from "../../types/embed.ts";
import { createCommand, uptime } from "../../utils/functions.ts";

createCommand({
    name:"uptime",
    module:"bot_information",
    description:"Get the uptime of the bot.",
    execute: async (message) => {
        let embed = new Embed()
            .setTitle("Uptime command:")
            .setDescription(`Bot was up for: ${await uptime()}`)
            .setColor("random")
            .setTimestamp()
        await message.send({embed})
    }
})