import { getUser } from "https://raw.githubusercontent.com/discordeno/discordeno/master/src/api/handlers/guild.ts";
import { Embed } from "../../types/embed.ts";
import { createCommand } from "../../utils/functions.ts";

createCommand({
    name:"privacypPolicy",
    module: "bot_information",
    aliases: ["privacy"],
    execute: async (message) => {
        let owner = await getUser("445234723590242304")
        let embed = new Embed()
            .setTitle("The bot's privacy policy:")
            .addField("What information is stored?", `
-the server id (for the server's configuration like logs channel, goodbye and welcome configuration...)
-channel ids (log channel, welcome channel, goodbye channel)
-user ids (muting the member.) 
            `)
            .addField("Who can access the data?", "Only the bot owner can access the stored information.")
            .addField("How can i remove those informations?", `
-Using the "remove" option on some configuration commands
-Using \`.config remove\` would remove the configuration entirely
-Unmuting members.
-Simply kicking the bot / deleting the stored channels or roles
            `)
            .addField("Questions and concerns", "If you have any questions, you can ask in the bot's support server usingg the link https://discord.gg/VR2438D or DM ``" + owner.username + "#" + owner.discriminator + "``")
            .setTimestamp()
        await message.send({embed})
    }
})