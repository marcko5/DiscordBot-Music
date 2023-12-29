const path = require('path');
const { SlashCommandBuilder } = require("discord.js");
const { getBasicEmbed } = require("../embedCreator.js");

const data = new SlashCommandBuilder()
.setName(path.basename(__filename).replace(".js", ""))
.setDescription("Sets queue's repeat mode 🔁")
.addStringOption(option => 
    option.setName("mode")
    .setDescription("Type off, queue or song to set repeat mode.. ✏️")
    .setRequired(true)
    .addChoices(
        { name: "off", value: "off" },
        { name: "queue", value: "queue" },
        { name: "song", value: "song" }
    ))

function execute(client, int){
    if (!client.distube.getQueue(int))
        int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nMy **queue is empty**, **add songs** to it first!`)] });
    else{
        var mode = int.options.getString("mode") == "off" ? 0 : int.options.getString("mode") == "queue" ? 1 : 2;
        client.distube.getQueue(int).setRepeatMode(mode);
        int.editReply({ embeds: [getBasicEmbed(client, "success", "(🔀) Shuffle", `Repeat mode of queue was set to \`${int.options.getString("off")}\`!`)]});
    }
}

module.exports = {
    data,
    execute
}