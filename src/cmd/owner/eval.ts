import { botcache } from "../../types/cache.ts";
import { Embed } from "../../types/embed.ts";
import { createCommand } from "../../utils/functions.ts";
import * as deps from "../../../deps.ts"

createCommand({
    name: "eval",
    module: "owner",
    ownerOnly: true,
    execute: async (message, args) => {
        let sliced = message.content.slice(message.content.split(" ")[0].length + 1)
        let vars = {
            botcache,
            Embed,
            deps
        }
        let clean = async (msg: string) => {
            if (msg.startsWith("```") && msg.endsWith("```")) {
                let idk: string | string[] = msg.split("\n")
                if (idk.length <= 1) {
                    idk = msg.split(" ")
                    if (idk.length <= 1) {idk = msg.slice(3)} else {
                        idk.shift()
                        idk.join(" ")
                    }
                } else {
                    idk.shift()
                    idk = idk.join("\n")
                }
                let text = idk.slice(0, -3)
                return text as string;
            } else {
                return msg;
            }
        }
        
		let okboomer = async (text: string) => {
            if (typeof(text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203).replace(/@/g, "@" + String.fromCharCode(8203)))
            else return text;
		};
        let code = await clean(sliced)
        try {
            let result = await eval(code)
            let output = Deno.inspect(result)
            await message.send(`\`\`\`ts\n${await okboomer(output)}\`\`\``).catch(async e => {
                await message.send("```ERROR```")
                await message.send(`\`\`\`ts\n${e}\`\`\``)
            })
            
        } catch (error) {
            await message.send("```ERROR```")
            await message.send(`\`\`\`ts\n${error}\`\`\``).catch(async e => {
                await message.send("```ERROR```")
                await message.send(`\`\`\`ts\n${e}\`\`\``)
            })
        }
    }
})
