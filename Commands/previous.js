const path = require("path");
const { SlashCommandBuilder } = require("discord.js");
const { getBasicEmbed } = require("../embedCreator.js");

const command = new SlashCommandBuilder()
.setName(path.basename(__filename).replace(".js", ""))
.setDescription("Skips to previous song ⏪");

const help = {
    section: "Commands 💬",
    description: command.description,
    message: `Section: \`${path.basename(__filename).replace(".js", "")}\`..\n> ${command.description}!\n\nREQUIREMENTS: Queue has to be playing & Previous song has to be listed in history!`
};

function process(client, int){
    if (!client.distube.getQueue(int))
        int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nMy **queue is empty**, **add songs** to it first!`)] });
    else{
        if (client.distube.getQueue(int).previousSongs.length == 0)
            int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nThere **is not a previous song** in queue!`)] });
        else{
            client.distube.getQueue(int).previous();
            int.editReply({ embeds: [getBasicEmbed(client, "success", "(⏪) Previous", `Playing previous song by ${int.member}!`)] });
        }
    }
}

module.exports = {
    command,
    help,
    process
}