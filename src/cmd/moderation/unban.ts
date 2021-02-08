import { getBans, unban, Guild, botHasPermission } from "../../../deps.ts";
import { Embed } from "../../types/embed.ts";
import { createCommand, log, } from "../../utils/functions.ts";
import { usageEmbed } from "../../utils/embeds.ts";

createCommand({
    name:"unban",
    module:"moderation",
    usage: "<member>",
    description: "Unban a banned member.",
    permission: ["BAN_MEMBERS"],
    execute: async (message, args, guild) => {
        if (!args[0]) return await message.send({embed: usageEmbed("unban <member>")})
        let bannedMembers = await getBans(message.guildID)
        let bannedUser = bannedMembers.find(e => e.user.id == args[0] || e.user.username + e.user.discriminator == args[0])
        if (!bannedUser) return await message.send("That's not a valid banned member.")
        if (!(await botHasPermission(message.guildID, ["BAN_MEMBERS"]))) return await message.send("I don't have enough permissions to unban this member.")
        await unban(message.guildID, bannedUser.user.id)
        await message.send("Member unbanned successfuly!")
        let embed = new Embed()
            .setTitle("A member got unbanned:")
            .addField("Unbanned by:", message.member?.tag as string)
            .addField("Unbanned member:", `${bannedUser.user.username}#${bannedUser.user.discriminator}`)
            .setTimestamp()
        await log(embed, message.guild as Guild)
    }
})