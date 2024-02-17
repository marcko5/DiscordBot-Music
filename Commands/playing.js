const path = require("path");
const { SlashCommandBuilder } = require("discord.js");
const { getBasicEmbed, getDistubeEmbed } = require("../embedCreator.js");

const command = new SlashCommandBuilder()
.setName(path.basename(__filename).replace(".js", ""))
.setDescription("Shows playing song 📄")

const help = {
    section: "Info 📢",
    description: command.description,
    message: `Section: \`${path.basename(__filename).replace(".js", "")}\`..\n> ${command.description}!\n\nREQUIREMENT: Queue has to be playing!`
};

async function process(client, int){
    if (!client.distube.getQueue(int)){
        int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nMy **queue is empty**, **add songs** to it first!`)] });
    }
    else
        int.editReply({ embeds: [getDistubeEmbed(client, "sendPlaying", client.distube.getQueue(int), client.distube.getQueue(int).songs[0])] });
}

module.exports = {
    command,
    help,
    process
}