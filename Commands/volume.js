const path = require("path");
const { SlashCommandBuilder } = require("discord.js");
const { getBasicEmbed } = require("../embedCreator.js");

const command = new SlashCommandBuilder()
.setName(path.basename(__filename).replace(".js", ""))
.setDescription("Sets queue's volume 🔊")
.addIntegerOption(option => 
    option.setName("percentage")
    .setDescription("Type percentage of volume.. ✏️")
    .setRequired(true)
    .setMinValue(1)
    .setMaxValue(100));

const help = {
    section: "Commands 💬",
    description: command.description,
    message: `Section: \`${path.basename(__filename).replace(".js", "")}\`..\n> ${command.description} via argument:\n> - With __percentage__ you can set volume in percentages of queue!\n\nREQUIREMENT: Queue has to be playing!\nTIP: The percentage argument is required!`
};

function process(client, int){
    if (!client.distube.getQueue(int))
        int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nMy **queue is empty**, **add songs** to it first!`)] });
    else{
        client.distube.getQueue(int).setVolume(int.options.getInteger("percentage"));
        int.editReply({ embeds: [getBasicEmbed(client, "success", "(🔊) Volume", `Queue's volume was set to \`${int.options.getInteger("percentage")}%\`!`)]});
    }
}

module.exports = {
    command,
    help,
    process
}