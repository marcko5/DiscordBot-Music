const path = require('path');
const { SlashCommandBuilder } = require("discord.js");
const { getBasicEmbed } = require("../embedCreator.js");

const data = new SlashCommandBuilder()
.setName(path.basename(__filename).replace(".js", ""))
.setDescription("Pauses current queue ⏸️")

function execute(client, int){
    if (!client.distube.getQueue(int))
        int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nMy **queue is empty**, **add songs** to it first!`)] });
    else{
        if (client.distube.getQueue(int).paused)
            int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nMy **queue is already** paused!`)] });
        else{
            client.distube.getQueue(int).pause();
            int.editReply({ embeds: [getBasicEmbed(client, "success", "(⏸️) Paused", `Queue was successfully paused by ${int.member}!`)] });
        }
    }
}

module.exports = {
    data,
    execute
}