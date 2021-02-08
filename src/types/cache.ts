import { Collection, EventHandlers } from "../../deps.ts";
import { Command } from "./command.ts";
import { Sabr, SabrTable } from "../../deps.ts"
import { config, goodbye, muted, remind, welcome } from "./schemas.ts";
import { reactionCollector } from "./collectorType.ts";

let sabr = new Sabr()

export let db = {
    sabr,
    config: new SabrTable<config>(sabr, "config"),
    muted: new SabrTable<muted>(sabr, "muted"),
    welcome: new SabrTable<welcome>(sabr, "welcome"),
    goodbye: new SabrTable<goodbye>(sabr, "goodbye"),
    remind: new SabrTable<remind>(sabr, "remind")
};

await sabr.init();

export let botcache = {
    ready: false,
    commands: new Collection<string, Command>(),
    readyAt: 0,
    db: db,
    eventHandlers: {} as EventHandlers,
    autoPaginator: new Collection<string, reactionCollector>()
}