const { SlashCommandBuilder } = require("discord.js");
const { getBasicEmbed } = require("../embedCreator.js");

const name = "queue";

const data = new SlashCommandBuilder()
.setName("queue")
.setDescription("Shows current queue 📄")

async function execute(client, int){
    if (!client.distube.getQueue(int))
        await int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${name}** an error occured..\nMy **queue is empty**, **add songs** to it first!\n`)], ephemeral: true });
    else{
        var text = client.distube.getQueue(int).songs
        .map((song, i) => `[**${i}**] [${song.name}](${song.url}) (\`${song.formattedDuration}\`) <${song.member}>`)
        .join("\n");
        if (client.distube.getQueue(int).songs.length == 1)
            await int.editReply({ embeds: [getBasicEmbed(client, "random", "(📄) Queue", `**Currently Playing**:\n> 🌐: [${client.distube.getQueue(int).songs[0].name}](${client.distube.getQueue(int).songs[0].url})\n> 🕒: \`${client.distube.getQueue(int).formattedCurrentTime}\` - ${client.distube.getQueue(int).songs[0].formattedDuration}\n> 👁️: ${client.distube.getQueue(int).songs[0].views ? client.distube.getQueue(int).songs[0].views : "Hidden"} | 👍: ${client.distube.getQueue(int).songs[0].likes ? client.distube.getQueue(int).songs[0].likes : "Hidden"} | 👎: ${client.distube.getQueue(int).songs[0].dislikes ? client.distube.getQueue(int).songs[0].dislikes : "Hidden"}${client.distube.getQueue(int).songs[0].ageRescricted ? ` | 🔞: ${client.distube.getQueue(int).songs[0].ageRescricted}` : ""}\n\n**Queue Informations**:\n> ${client.distube.getQueue(int).playing ? "▶️: Playing" : "⏸️: Paused"}${client.distube.getQueue(int).autoplay ? " | 🤖: Autoplay" : ""}\n> 🕒: \`${client.distube.getQueue(int).formattedCurrentTime}\` - ${client.distube.getQueue(int).formattedDuration}${client.distube.getQueue(int).filters.values.length > 0 ? `\n> 📦: ${client.distube.getQueue(int).filters.values.join(", ")}` : ""}\n\n${text}`)]});
        else
            await int.editReply({ embeds: [getBasicEmbed(client, "random", "(📄) Queue", `**Currently Playing**:\n> 🌐: [${client.distube.getQueue(int).songs[0].name}](${client.distube.getQueue(int).songs[0].url})\n> 🕒: \`${client.distube.getQueue(int).formattedCurrentTime}\` - ${client.distube.getQueue(int).songs[0].formattedDuration}\n> 👁️: ${client.distube.getQueue(int).songs[0].views ? client.distube.getQueue(int).songs[0].views : "Hidden"} | 👍: ${client.distube.getQueue(int).songs[0].likes ? client.distube.getQueue(int).songs[0].likes : "Hidden"} | 👎: ${client.distube.getQueue(int).songs[0].dislikes ? client.distube.getQueue(int).songs[0].dislikes : "Hidden"}${client.distube.getQueue(int).songs[0].ageRescricted ? ` | 🔞: ${client.distube.getQueue(int).songs[0].ageRescricted}` : ""}\n\n**Queue Informations**:\n> ${client.distube.getQueue(int).playing ? "▶️: Playing" : "⏸️: Paused"}${client.distube.getQueue(int).autoplay ? " | 🤖: Autoplay" : ""}\n> 🕒: \`${client.distube.getQueue(int).formattedCurrentTime}\` - ${client.distube.getQueue(int).formattedDuration}${client.distube.getQueue(int).filters.values.length > 0 ? `\n> 📦: ${client.distube.getQueue(int).filters.values.join(", ")}` : ""}`)]});
    }
}

module.exports = {
    name,
    data,
    execute
}