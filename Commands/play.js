const { SlashCommandBuilder } = require("discord.js");
const { getBasicEmbed } = require("../embedCreator.js");

const name = "play";

const data = new SlashCommandBuilder()
.setName("play")
.setDescription("Plays song or playlist ▶️")
.addStringOption(option =>
    option.setRequired(true)
    .setName("media")
    .setDescription("Type name or URL.. ✏️"));

async function execute(client, int){
    if (!int.member.voice.channel && client.distube.getQueue(int))
        await int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${name}** an error occured..\nYou have to be **joined in voice** to use this command!\n(I have to **be playin** something!)`)], ephemeral: true });
    else{
        client.distube.play(int.member.voice.channel, int.options.getString("media"), { member: int.member, textChannel: int.channel });
        await int.editReply({ embeds: [getBasicEmbed(client, "random", "(🔎) Searching", `You wanted to search: ${int.options.getString("media")}`)]});
    }
}

module.exports = {
    name,
    data,
    execute
}