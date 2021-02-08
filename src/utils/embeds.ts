import { Embed } from "../types/embed.ts";

export let usageEmbed = (...usage: string[]) => new Embed().setDescription(`**${usage.join(" ")}**`)