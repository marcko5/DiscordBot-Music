const path = require('path');
const { SlashCommandBuilder } = require("discord.js");
const { getBasicEmbed, getFormattedNumber } = require("../embedCreator.js");

const data = new SlashCommandBuilder()
.setName(path.basename(__filename).replace(".js", ""))
.setDescription("Shows current queue 📄")

function execute(client, int){
    if (!client.distube.getQueue(int)){
        int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nMy **queue is empty**, **add songs** to it first!`)] });
    }
    else{
        var text = client.distube.getQueue(int).songs
        .map((song, i) => `[**${i+1}**] [${song.name}](${song.url}) (\`${song.formattedDuration}\`) <${song.member}>`)
        .join("\n");
        int.editReply({ embeds: [getBasicEmbed(client, "random", "(📄) Queue", `**Currently Playing**:\n> 🌐: [${client.distube.getQueue(int).songs[0].name}](${client.distube.getQueue(int).songs[0].url})\n> 🕒: \`${client.distube.getQueue(int).formattedCurrentTime}\` - ${client.distube.getQueue(int).songs[0].formattedDuration}\n> 👁️: ${client.distube.getQueue(int).songs[0].views ? getFormattedNumber(client.distube.getQueue(int).songs[0].views) : "Hidden"}\n> 👤: ${client.distube.getQueue(int).songs[0].member}\n\n**Queue Informations**:\n> ${client.distube.getQueue(int).playing ? "▶️: Playing" : "⏸️: Paused"}\n> 🔁: Repeat ${client.distube.getQueue(int).repeatMode == 0 ? "Off" : client.distube.getQueue(int).repeatMode == 1 ? "Song" : "Queue"}\n> 🤖: Autoplay ${client.distube.getQueue(int).autoplay ? "On" : "Off"}\n> 🕒: \`${client.distube.getQueue(int).formattedCurrentTime}\` - ${client.distube.getQueue(int).formattedDuration}${client.distube.getQueue(int).filters.size > 0 ? `\n> 📦: ${client.distube.getQueue(int).filters.names.join(", ")}` : ""}${client.distube.getQueue(int).songs.length > 1 ? `\n\n${text}` : ""}`)] });
    }
}

module.exports = {
    data,
    execute
}