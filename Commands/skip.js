const path = require("path");
const { SlashCommandBuilder } = require("discord.js");
const { getBasicEmbed } = require("../embedCreator.js");

const command = new SlashCommandBuilder()
.setName(path.basename(__filename).replace(".js", ""))
.setDescription("Skips to next song ⏩")
.addIntegerOption(option =>
    option.setName("count")
    .setRequired(true)
    .setDescription("Type count of songs you want to skip/revert.. ✏️"));

const help = {
    section: "Commands 💬",
    description: command.description,
    message: `Section: \`${path.basename(__filename).replace(".js", "")}\`..\n> ${command.description} via argument:\n> - With __count__ you can skip <count> amount of songs in queue!\n\nREQUIREMENT: Queue has to be playing!\nTIP: The count argument is required!`
}

function process(client, int){
    if (!client.distube.getQueue(int))
        int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nMy **queue is empty**, **add songs** to it first!`)] });
    else{
        if (int.options.getInteger("count") > client.distube.getQueue(int).songs.length || int.options.getInteger("count")*(-1) > client.distube.getQueue(int).previousSongs.length)
            int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nThere is not a any song **with this count** in queue!`)] });
        else if (int.options.getInteger("count") == 0)
            int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nYou can't skip **songs with 0** count!`)] });
        else{
            client.distube.jump(int, int.options.getInteger("count"));
            int.editReply({ embeds: [getBasicEmbed(client, "success", "(↔️) Skip", `Skipping queue \`${int.options.getInteger("count")}\` time${int.options.getInteger("count") > 1 ? "s" : int.options.getInteger("count") < -1 ? "s" : ""} by ${int.member}!`)] });
        }
    }
}

module.exports = {
    command,
    help,
    process
}