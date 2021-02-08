import { botcache } from "../types/cache.ts";
import { Embed } from "../types/embed.ts";
import { Guild, botHasChannelPermissions } from "../../deps.ts";
import { config } from "../types/schemas.ts";
import { Command } from "../types/command.ts"
import { TimeToString } from "./time.ts";

export let uptime = async () => {
    let readyAt = Date.now() - botcache.readyAt
    let uptimeString = await TimeToString(readyAt)
    return uptimeString
}

let uniqueFilePathCounter = 0;
export let importDirectory =  async (path: string) => {
    let files = Deno.readDirSync(Deno.realPathSync(path));

    for (let file of files) {
        if (!file.name) continue;

        let currentPath = `${path}/${file.name}`;
        if (file.isFile) {
            await import(`file:///${currentPath}#${uniqueFilePathCounter}`);
            continue;
        }

        await importDirectory(currentPath);
    }
    uniqueFilePathCounter++;
}

export let log = async (embed: Embed, guild: Guild) => {
    if (!botcache.db.config.has(guild.id)) return
    let res = await botcache.db.config.get(guild.id) as config
    if (!res.logs) return
    let channel = guild.channels.get(res.logs)
    if (!channel) return await botcache.db.config.update(guild.id, {logs: undefined})
    if (!await botHasChannelPermissions(channel.id, ["SEND_MESSAGES", "EMBED_LINKS"])) return
    try {await channel.send({embed})} catch {console.log(embed)}
}

export let createCommand =  async  (command: Command) => {
    botcache.commands.set(command.name, command)
    console.log(`${command.name} has been loaded!`)
}
