const path = require("path");
const { SlashCommandBuilder } = require("discord.js");
const { getBasicEmbed } = require("../embedCreator.js");

const command = new SlashCommandBuilder()
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
    ));

const help = {
    section: "Commands 💬",
    description: command.description,
    message: `Section: \`${path.basename(__filename).replace(".js", "")}\`..\n> ${command.description} via argument:\n> - With __<OFF>__ you can turn off repeat mode!\n> - With __<QUEUE>__ you can turn on queue repeat mode!\n> - With __<SONG>__ you can turn on song repeat mode!\n\nREQUIREMENT: Queue has to be playing!\nTIP: The mode argument is required!`
};

function process(client, int){
    if (!client.distube.getQueue(int))
        int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nMy **queue is empty**, **add songs** to it first!`)] });
    else{
        var mode = int.options.getString("mode") == "off" ? 0 : int.options.getString("mode") == "queue" ? 2 : 1;
        client.distube.getQueue(int).setRepeatMode(mode);
        int.editReply({ embeds: [getBasicEmbed(client, "success", "(🔀) Shuffle", `Repeat mode of queue was set to \`${int.options.getString("mode")}\`!`)]});
    }
}

module.exports = {
    command,
    help,
    process
}