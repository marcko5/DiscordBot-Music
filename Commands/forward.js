const path = require('path');
const { SlashCommandBuilder } = require("discord.js");
const { getBasicEmbed, getFormattedTime } = require("../embedCreator.js");

const data = new SlashCommandBuilder()
.setName(path.basename(__filename).replace(".js", ""))
.setDescription("Forwards current song ⏩")
.addIntegerOption(option =>
    option.setName("seconds")
    .setRequired(false)
    .setDescription("Type number of seconds.. ✏️"))
.addIntegerOption(option =>
    option.setName("minutes")
    .setRequired(false)
    .setDescription("Type number of minutes.. ✏️"))
.addIntegerOption(option =>
    option.setName("hours")
    .setRequired(false)
    .setDescription("Type number of hours.. ✏️"))

function execute(client, int){
    if (!client.distube.getQueue(int))
        int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nMy **queue is empty**, **add songs** to it first!`)] });
    else{
        if (!int.options.getInteger("seconds") && !int.options.getInteger("minutes") && !int.options.getInteger("hours"))
            int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nYou have to specify time to forward!`)] });
        else{
            const time = int.options.getInteger("seconds") + int.options.getInteger("minutes")*60 + int.options.getInteger("hours")*3600;
            client.distube.getQueue(int).seek(client.distube.getQueue(int).currentTime + time);
            int.editReply({ embeds: [getBasicEmbed(client, "success", "(⏭️) Forward", `Forwarding song by \`${getFormattedTime(time)}\`!`)] });
        }
    }
}

module.exports = {
    data,
    execute
}