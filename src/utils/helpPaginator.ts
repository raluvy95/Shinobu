import { Message, Collection, walk, botHasPermission, sleep } from "../../deps.ts";
import { botcache } from "../types/cache.ts";
import { Embed } from "../types/embed.ts";
import { helpPaginatorMap } from "../types/helpPaginator.ts"

export let helpPaginator = async (message: Message) => {
	let commands = botcache.commands.map(e => { return {name: e.name, module: e.module, description: !e.description ? "no description" : e.description} }).filter(e => e.module != "owner")
	let modules = walk("./src/cmd/", {includeFiles: false})
	let num = 0
	let map = new Collection<string, helpPaginatorMap>()
	for await (let module of modules) {
		for (let command of commands.filter(e => e.module == module.name)) {
			map.set(command.name, {command: command, page: num})
		}
		if (module.name != "owner") num++
    }
	let current = 1
	let fullpage = map.map(e => e).filter(e => e.page == current)
    let embed = new Embed()
        .setTitle(`Category ${fullpage[0].command.module} (${fullpage.length} commands):`)
        .setDescription(fullpage.map(e => `\`\`${e.command.name}\`\`\n${e.command.description ? e.command.description : "No description"}`).join(`\n\n`))
		.setTimestamp()
		.setFooter(`Page ${fullpage[0].page}/${map.map(e => e.page)[map.map(e => e.page).length - 1]} (${map.size} total commands)`)
	let msg = await message.send({embed})
	await msg.addReaction("⏮️")
	await msg.addReaction("⬅️")
	await msg.addReaction("⏹️")
	await msg.addReaction("➡️")
	await msg.addReaction("⏭️")
	botcache.autoPaginator.set(msg.id, {
		message: msg.id,
		author: message.author.id,
		commands: map.map(e => e)
	})
	await sleep(1000 * 60 * 30)
	botcache.autoPaginator.delete(msg.id)
	if (!(await botHasPermission(message.guildID, ["MANAGE_MESSAGES"]))) return
	await msg.removeAllReactions()
}