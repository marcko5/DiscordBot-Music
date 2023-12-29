const path = require('path');
const { SlashCommandBuilder } = require("discord.js");
const { getBasicEmbed } = require("../embedCreator.js");

const data = new SlashCommandBuilder()
.setName(path.basename(__filename).replace(".js", ""))
.setDescription("Skips to next song ⏩")

function execute(client, int){
    if (!client.distube.getQueue(int))
        int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nMy **queue is empty**, **add songs** to it first!`)] });
    else{
        if (client.distube.getQueue(int).songs.lenght == 1)
            int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nThere **is not a next song** in queue!`)] });
        else{
            client.distube.getQueue(int).skip();
            int.editReply({ embeds: [getBasicEmbed(client, "success", "(⏩) Next", `Playing next song by ${int.member}!`)] });
        }
    }
}

module.exports = {
    data,
    execute
}