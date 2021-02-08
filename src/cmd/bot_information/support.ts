import { Embed } from "../../types/embed.ts";
import { createCommand } from "../../utils/functions.ts";

createCommand({
    name:"support",
    module:"bot_information",
    description: "Gives the support server of the bot!",
    execute: async (message) => {
        let embed = new Embed()
            .setTitle("Support server:")
            .setDescription("You can join the support server by using this link: https://discord.gg/VR2438D")
            .setTimestamp()
            
        await message.send({embed})
    }
})