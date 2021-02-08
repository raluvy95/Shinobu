import { Embed } from "../../types/embed.ts";
import { createCommand } from "../../utils/functions.ts";

createCommand({
    name:"ping",
    module:"bot_information",
    description: "Get the latency of the bot.",
    execute: async (message) => {
        let msg = await message.send("Pinging...")
        let bot_latency = Date.now() - msg.timestamp
        let embed = new Embed()
            .setTitle("PONG!")
            .setDescription(`${bot_latency}ms`)
            .setTimestamp()
        await msg.edit({content: "", embed}) 
    } 
})