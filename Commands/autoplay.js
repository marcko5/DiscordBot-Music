const path = require('path');
const { SlashCommandBuilder } = require("discord.js");
const { getBasicEmbed } = require("../embedCreator.js");

const data = new SlashCommandBuilder()
.setName(path.basename(__filename).replace(".js", ""))
.setDescription("Toggles queue's autoplay 🤖")

function execute(client, int){
    if (!client.distube.getQueue(int))
        int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nMy **queue is empty**, **add songs** to it first!`)] });
    else{
        const song = client.distube.getQueue(int).addRelatedSong();
        int.editReply({ embeds: [getBasicEmbed(client, "success", "(🤖) Autoplay", `Added song [${song.name}](${song.url})!`)]});
    }
}

module.exports = {
    data,
    execute
}