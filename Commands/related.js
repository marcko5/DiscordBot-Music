const path = require('path');
const { SlashCommandBuilder } = require("discord.js");
const { getBasicEmbed } = require("../embedCreator.js");

const data = new SlashCommandBuilder()
.setName(path.basename(__filename).replace(".js", ""))
.setDescription("Adds related song to queue 🔗")

function execute(client, int){
    if (!client.distube.getQueue(int))
        int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nMy **queue is empty**, **add songs** to it first!`)] });
    else{
        client.distube.getQueue(int).toggleAutoplay();
        int.editReply({ embeds: [getBasicEmbed(client, "success", "(🔗) Related", `Autoplay has been turned ${client.distube.getQueue(int).autoplay} by ${int.member}!`)]});
    }
}

module.exports = {
    data,
    execute
}