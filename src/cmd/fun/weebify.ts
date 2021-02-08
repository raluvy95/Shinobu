import { usageEmbed } from "../../utils/embeds.ts";
import { createCommand } from "../../utils/functions.ts";

createCommand({
    name:"weebify",
    module:"fun",
    description:"Turn text to a weeb text :3",
    usage: "<message>",
    execute: async (message, args) => {
        let furry = async () => {
            let me = ['OwO!', ':3', 'uwu', 'oWo, whats this?', 'uw- OwO!', '']
            let index = Math.floor(Math.random() * (me.length - 1) + 1)
            return me[index]
        }
        let weeb = async (text1: string) => {
            let text = text1.toLowerCase().replace(/o/g, "ow")
                                          .replace(/v/g, "w")
                                          .replace(/i/g, 'wi')
                                          .replace(/y/g, 'i')
                                          .replace(/OwO/g, 'UwU')
                                          .replace(/a/g, 'o')
                                          .replace(/r/g, 'rw')
                                          .replace(/e/g, 'we')
                                          .replace(/t/g, 'ht')
                                          .replace(/c/g, 'ch')
                                          .replace(/u/g, 'uw')
            return `${text} ${await furry()}`
        }
        
        if(!args[0]) {
            return await message.send({embed: usageEmbed("weebify <message>")})
        } else {
            return await message.send({content:await weeb(args.join(' ')), mentions: {parse: []}})
        }
    }
})