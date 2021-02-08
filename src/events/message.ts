import { botcache } from "../types/cache.ts";
import { sendMessage, getChannel, ChannelTypes, memberIDHasPermission } from "../../deps.ts"
import { getApplicationInformation } from "https://raw.githubusercontent.com/discordeno/discordeno/master/src/api/handlers/oauth.ts";

botcache.eventHandlers.messageCreate = async (message) => {
    let prefix: string;
    if (!message.guild) return
    if (botcache.db.config.has(message.guildID)) {
        let config = await botcache.db.config.get(message.guild.id)
        prefix = config?.prefix ? config.prefix : "."
    } else prefix = "."
    if (!message.content.startsWith(prefix) || message.author.bot)
        return;
    let args = message.content.slice(prefix.length).split(/ +/);
    let commandName = args.shift()?.toLowerCase();
    if (!commandName)
        return;
    let command = botcache.commands.get(commandName) || botcache.commands.find(cmd => {
        if (cmd.aliases) {
        return cmd.aliases.includes(commandName as string);
        }
        else
        return false;
    });
    let application = await getApplicationInformation()
    let ownerID = application.owner.id as string
    
    let channel = await getChannel(message.channelID);
    if (!command) 
        return
    if (command.nsfwOnly && !channel.nsfw)
        return await sendMessage(message.channelID, "This command can only be executed in nsfw channels");
    if (command.permission && !(await memberIDHasPermission(message.author.id, message.guildID, command.permission)))
        return await sendMessage(message.channelID, `You don't have permissions to use this command`);
    if (channel.type == ChannelTypes.DM)
        return await sendMessage(message.channelID, "You can't use commands in dm's");
    if (command.ownerOnly && message.author.id != ownerID)
        return await sendMessage(message.channelID, "This command is only for the owner.");
    try {
        console.info(`"${command.name}" is being executed by "${message.author.username}#${message.author.discriminator}"`)
        await command.execute(message, args, message.guild);
        console.info(`${command.name} has been successfuly processed!`)
    } catch (e) {
        console.error(`${command.name} has been received an error while processing:\n${e}`)
    }
}

