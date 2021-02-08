import { getUser, botID, Member, avatarURL, cache } from "../../../deps.ts";
import { deconstruct } from "./../../utils/snowflake.ts";
import { basic } from "../../utils/time.ts";
import { Embed } from "../../types/embed.ts";
import { createCommand } from "../../utils/functions.ts";


createCommand({
    name:"botinfo",
    module:"bot_information",
    description: "Get information about the bot.",
    execute: async (message, _, guild) => {
        let member = guild.members.find(e => e.id == botID) as Member
        let owner = `${(await getUser("445234723590242304")).username}#${(await getUser("445234723590242304")).discriminator}`
        let user = await getUser(botID)
        let smth = await deconstruct(botID)
        let humanCount = cache.members.filter(e => !(e.bot as boolean)).size
        let botCount = cache.members.filter(e => (e.bot as boolean)).size
        
        let stats = { 
            guilds: cache.guilds.size,
            users: cache.members.size,
            humans: humanCount,
            bots: botCount,
        }
        let version = `Discordeno v10.2.0\nDeno v${Deno.version.deno}`
        let support = "[You can join the support server by clicking here](https://discord.gg/VR2438D)"
        let botinvite = `[You can invite the bot by clicking here](https://discord.com/api/oauth2/authorize?client_id=${botID}&permissions=1914006726&scope=bot)`
        let created_at = await basic(smth)
        let embed = new Embed()
            .setTitle(`${user.username} Bot Information:`)
            .addField("👑 Owner Of The Bot 👑 :", owner)
            .addField("💻 Bot Created Using 💻 :", version)
            .addField("⏰ Bot Created At ⏰ :", created_at)
            .addField("🏠 Support Server Invite 🏠 :", `${support}`)
            .addField("🤖 Invite The Bot 🤖 :", `${botinvite}`)
            .addField("📶 Bot Stats 📶 :", 
    `
    Total Users: ${stats.users} Users
    Total Humans: ${stats.humans} Humans
    Total Bots: ${stats.bots} Bots
    Total Servers: ${stats.guilds} Servers
    `
            )
            .setColor("random")
            .setTimestamp()
            .setThumbnail(avatarURL(member))
        await message.send({embed})
    } 
})