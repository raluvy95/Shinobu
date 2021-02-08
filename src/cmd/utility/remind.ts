import { botcache } from "../../types/cache.ts";
import { usageEmbed } from "../../utils/embeds.ts";
import { createCommand } from "../../utils/functions.ts";
import { StringToTime, TimeToString } from "../../utils/time.ts";

createCommand({
    name:"remind",
    module:"utility",
    usage: "<time> [reason]",
    description: "Set up a reminder.",
    execute: async (message, args) => {
        if (!message.guild) return
		if (!args[0]) return await message.send({embed: usageEmbed("remind <time> [reason]")})
		let reason = !args[1] ? "No reason specified" : args.join(" ").slice(args[0].length + 1)
		let tim = args[0]
        let timeout = await StringToTime(message, tim) as number
        if (isNaN(timeout)) return
        let moment =  await TimeToString(timeout)
        let msg = await message.send({content: `will remind you in ${moment} for the reason: ${reason}`, mentions: {parse: []}})
        if (!botcache.db.remind.has(message.guildID)) await botcache.db.remind.create(message.guildID, {id: message.guild.id, members: [{id: message.author.id, channel: msg.channelID, message: msg.id, remind: timeout + Date.now(), reason}]})
        else {
            let stuff = await botcache.db.remind.get(message.guild.id)
            if (!stuff) return
            let members = stuff.members.filter(e => e.id != message.author.id)
            members.push({id: message.author.id, reason, remind: timeout + Date.now(), message: msg.id, channel: msg.channelID})
            await botcache.db.remind.create(`${message.guild.id}`, {members})
        }
        setTimeout(async () => {
            if (!message.guild) return
            let stuff = await botcache.db.remind.get(message.guild.id)
            if (!stuff) return
            let members = stuff.members.filter(e => e.id != message.author.id)
            await botcache.db.remind.update(`${message.guildID}`, {members})
            if (!message.channel) return
            await msg.reply({content: `${message.member?.mention} reminding you now`, mentions: {parse: ["users"]}})
        }, timeout)
    }
})