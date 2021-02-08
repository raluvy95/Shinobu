import { Permission, Message, Guild } from "../../deps.ts";

export interface Command {
    name: string,
    module: string,
    aliases?: string[],
    hidden?: boolean,
    permission?: Permission[],
    cooldown?: number,
    description?: string,
    ownerOnly?: boolean,
    nsfwOnly?: boolean,
    usage?: string,
    execute: (message: Message, args: string[], guild: Guild) => unknown;
}