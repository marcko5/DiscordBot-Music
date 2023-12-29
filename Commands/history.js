const path = require('path');
const { SlashCommandBuilder } = require("discord.js");
const { getBasicEmbed, getFormattedNumber } = require("../embedCreator.js");

const data = new SlashCommandBuilder()
.setName(path.basename(__filename).replace(".js", ""))
.setDescription("Shows current history 📖")

function execute(client, int){
    if (!client.distube.getQueue(int)){
        int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nMy **queue is empty**, **add songs** to it first!`)] });
    }
    else{
        if (client.distube.getQueue(int).previousSongs.length == 0)
            int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nMy **queue history is empty**, **add songs** to it first!`)] });
        else{
            var text = client.distube.getQueue(int).previousSongs.songs
            .map((song, i) => `[**${i+1}**] [${song.name}](${song.url}) (\`${song.formattedDuration}\`) <${song.member}>`)
            .join("\n");
            int.editReply({ embeds: [getBasicEmbed(client, "random", "(📖) History", text)] });
        }
    }
}

module.exports = {
    data,
    execute
}