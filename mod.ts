import { startBot, Intents } from "./deps.ts";
import { importDirectory } from "./src/utils/functions.ts"
import { settings } from "./settings.ts"
import { botcache } from "./src/types/cache.ts";

await Promise.all(
  [
    "./src/cmd/",
    "./src/events/"
  ].map(
    (path) => importDirectory(Deno.realPathSync(path)),
  ),
);

await startBot({
  token: settings.token,
  intents: [Intents.GUILDS, Intents.GUILD_MESSAGES, Intents.GUILD_MEMBERS, Intents.GUILD_PRESENCES, Intents.GUILD_MESSAGE_REACTIONS, Intents.GUILD_INTEGRATIONS, Intents.GUILD_BANS],
  eventHandlers: botcache.eventHandlers
});
