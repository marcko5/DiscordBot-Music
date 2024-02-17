const path = require("path");
const { SlashCommandBuilder } = require("discord.js");
const { getBasicEmbed, getFormattedTime } = require("../embedCreator.js");

const command = new SlashCommandBuilder()
    .setName(path.basename(__filename).replace(".js", ""))
    .setDescription("Sets song's time 🕒")
    .addIntegerOption(option =>
        option.setName("seconds")
        .setRequired(false)
        .setDescription("Type number of seconds.. ✏️")
        .setMinValue(1))
    .addIntegerOption(option =>
        option.setName("minutes")
        .setRequired(false)
        .setDescription("Type number of minutes.. ✏️")
        .setMinValue(1))
    .addIntegerOption(option =>
        option.setName("hours")
        .setRequired(false)
        .setDescription("Type number of hours.. ✏️")
        .setMinValue(1));

const help = {
    section: "Commands 💬",
    description: command.description,
    message: `Section: \`${path.basename(__filename).replace(".js", "")}\`..\n> ${command.description} via arguments:\n> - With __seconds__ you can set time to seconds!\n> - With __minutes__ you can set time to minutes!\n> - With __hours__ you can set time to hours!\n\nREQUIREMENT: Queue has to be playing!\nTIP: Atleast one argument have to be set!`
};

function process(client, int){
    if (!client.distube.getQueue(int))
        int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nMy **queue is empty**, **add songs** to it first!`)] });
    else{
        if (!int.options.getInteger("seconds") && !int.options.getInteger("minutes") && !int.options.getInteger("hours"))
            int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..You have to specify time to skip!`)] });
        else{
            const time = int.options.getInteger("seconds") + int.options.getInteger("minutes")*60 + int.options.getInteger("hours")*3600;
            client.distube.getQueue(int).seek(time);
            int.editReply({ embeds: [getBasicEmbed(client, "success", "(🕒) Time", `Skipping song to time \`${getFormattedTime(time)}\`!`)] });
        }
    }
}

module.exports = {
    command,
    help,
    process
}