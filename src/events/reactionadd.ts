import { editMessage, removeUserReaction, botHasPermission } from "../../deps.ts";
import { botcache } from "../types/cache.ts";
import { Embed } from "../types/embed.ts";
let current = 1
botcache.eventHandlers.reactionAdd = async (_, emoji, userid, message) => {
    if (!message) return
    if (!botcache.autoPaginator.has(message.id)) return
    let autoPaginator = botcache.autoPaginator.get(message.id)
    if (!autoPaginator) return
    if (autoPaginator.author != userid) return
    let emojis = ["⏮️", "⬅️", "⏹️", "➡️", "⏭️"]
    if (!emoji.name) return
    if (!emojis.includes(emoji.name)) return
    if (emoji.name == "⏹️") {
        if (await botHasPermission(message.guildID, ["MANAGE_MESSAGES"])) await message.removeAllReactions()
        return botcache.autoPaginator.delete(message.id)
    }
    if (emoji.name == "⏮️") {
        if (await botHasPermission(message.guildID, ["MANAGE_MESSAGES"])) await removeUserReaction(message.channelID, message.id, emoji.name, userid)
        if (current == 1) return
        let commands = autoPaginator.commands.filter(e => e.page == 1).map(e => e.command)
        current = 1
        let embed = new Embed()
            .setTitle(`Category ${commands[0].module} (${commands.length} commands)`)
            .setDescription(commands.map(e => `\`\`${e.name}\`\`\n${e.description ? e.description : "No description"}`).join(`\n\n`))
            .setTimestamp()
            .setFooter(`Page ${current}/${autoPaginator.commands.map(e => e.page)[autoPaginator.commands.map(e => e.page).length - 1]} (${autoPaginator.commands.length} total commands)`)
        await editMessage(message, {embed})
    }
    if (emoji.name == "⏭️") {
        if (await botHasPermission(message.guildID, ["MANAGE_MESSAGES"])) await removeUserReaction(message.channelID, message.id, emoji.name, userid)
        if (current == autoPaginator.commands.map(e => e.page).length - 1) return
        let commands = autoPaginator.commands.filter(e => e.page == autoPaginator?.commands.map(e => e.page)[autoPaginator.commands.map(e => e.page).length - 1]).map(e => e.command)
        current = autoPaginator.commands.map(e => e.page)[autoPaginator.commands.map(e => e.page).length - 1]
        let embed = new Embed()
            .setTitle(`Category ${commands[0].module} (${commands.length} commands)`)
            .setDescription(commands.map(e => `\`\`${e.name}\`\`\n${e.description ? e.description : "No description"}`).join(`\n\n`))
            .setTimestamp()
            .setFooter(`Page ${current}/${autoPaginator.commands.map(e => e.page)[autoPaginator.commands.map(e => e.page).length - 1]} (${autoPaginator.commands.length} total commands)`)
        await editMessage(message, {embed})
    }
    if (emoji.name == "➡️") {
        if (await botHasPermission(message.guildID, ["MANAGE_MESSAGES"])) await removeUserReaction(message.channelID, message.id, emoji.name, userid)
        if (current == autoPaginator.commands.map(e => e.page)[autoPaginator.commands.map(e => e.page).length - 1]) current = 1
        else current += 1
        let commands = autoPaginator.commands.filter(e => e.page == current).map(e => e.command)
        let embed = new Embed()
            .setTitle(`Category ${commands[0].module} (${commands.length} commands)`)
            .setDescription(commands.map(e => `\`\`${e.name}\`\`\n${e.description ? e.description : "No description"}`).join(`\n\n`))
            .setTimestamp()
            .setFooter(`Page ${current}/${autoPaginator.commands.map(e => e.page)[autoPaginator.commands.map(e => e.page).length - 1]} (${autoPaginator.commands.length} total commands)`)
        await editMessage(message, {embed})
    }
    if (emoji.name == "⬅️") {
        if (await botHasPermission(message.guildID, ["MANAGE_MESSAGES"])) await removeUserReaction(message.channelID, message.id, emoji.name, userid)
        if (current == 1) current = autoPaginator.commands.map(e => e.page)[autoPaginator.commands.map(e => e.page).length - 1]
        else current -= 1
        let commands = autoPaginator.commands.filter(e => e.page == current).map(e => e.command)
        let embed = new Embed()
            .setTitle(`Category ${commands[0].module} (${commands.length} commands)`)
            .setDescription(commands.map(e => `\`\`${e.name}\`\`\n${e.description ? e.description : "No description"}`).join(`\n\n`))
            .setTimestamp()
            .setFooter(`Page ${current}/${autoPaginator.commands.map(e => e.page)[autoPaginator.commands.map(e => e.page).length - 1]} (${autoPaginator.commands.length} total commands)`)
        await editMessage(message, {embed})
    }
}