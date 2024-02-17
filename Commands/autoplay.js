const path = require("path");
const { SlashCommandBuilder } = require("discord.js");
const { getBasicEmbed } = require("../embedCreator.js");

const command = new SlashCommandBuilder()
.setName(path.basename(__filename).replace(".js", ""))
.setDescription("Toggles queue's autoplay 🤖")

const help = {
    section: "Commands 💬",
    description: command.description,
    process: `Section: \`${path.basename(__filename).replace(".js", "")}\`..\n> ${command.description}!\nYou can see its state in /queue!\n\nREQUIREMENT:  Queue has to be playing!\nTIP: Don't turn this feature on!`
};

function process(client, int){
    if (!client.distube.getQueue(int))
        int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nMy **queue is empty**, **add songs** to it first!`)] });
    else{
        client.distube.getQueue(int).toggleAutoplay();
        int.editReply({ embeds: [getBasicEmbed(client, "success", "(🤖) Autoplay", `Autoplay has been turned ${client.distube.getQueue(int).autoplay} by ${int.member}!`)]});
    }
}

module.exports = {
    command,
    help,
    process
}