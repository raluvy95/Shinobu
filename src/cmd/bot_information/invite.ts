import { Embed } from "../../types/embed.ts";
import { createCommand } from "../../utils/functions.ts";

createCommand({
    name:"invite",
    module:"bot_information",
    description: "Gives the invite of the bot!",
    execute: async (message) => {
        let embed = new Embed()
            .setTitle("Bot invite:")
            .setDescription("You can invite the bot by clicking this link: https://discord.com/api/oauth2/authorize?client_id=${botID}&permissions=1914006726&scope=bot")
            .setTimestamp()
        await message.send({embed})
    }
})