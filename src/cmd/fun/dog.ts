import { botHasChannelPermissions } from "../../../deps.ts";
import { Embed } from "../../types/embed.ts";
import { createCommand } from "../../utils/functions.ts";

createCommand({
    name:"dog",
	module:"fun",
	description: "Send dog pictures.",
	cooldown: 5,
    execute:async (message) => {
		if (!await botHasChannelPermissions(message.channelID, ["EMBED_LINKS"])) return await message.send("You have to give me `embed links` permission in this channel to use this command!")
		let json = await fetch(`https://www.reddit.com/r/dog/top.json?sort=top&t=day&limit=20`)
		let res = await json.json()
		let edata = res.data.children
		let data = edata[Math.floor(Math.random() * edata.length)].data
		let image = data.url
		let title = data.title
		let ups = data.ups
		let link = "https://reddit.com/" + data.permalink
		let comments = data.num_comments
		let embed = new Embed().setTitle(title)
			.setURL(link)
			.setImage(image)
			.setFooter("⬆️ " + ups + " || 💬 " + comments)
			.setColor("random")
		await message.send({embed})
    }
})