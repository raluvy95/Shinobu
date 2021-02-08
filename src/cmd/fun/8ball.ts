import { settings } from "../../../settings.ts"
import { createCommand } from "../../utils/functions.ts";
import { usageEmbed } from "../../utils/embeds.ts";

createCommand({
    name:"8ball",
    module:"fun",
    usage: "<question>",
    description:"Ask a question and the bot will respond",
    execute: async (message, args) => {
        
        if (!args[0]) return await message.send({embed: usageEmbed("8ball <question>")})
        let answer = settings["8ball_questions"][Math.floor(Math.random() * settings["8ball_questions"].length)]
        await message.send(answer)
    }
})