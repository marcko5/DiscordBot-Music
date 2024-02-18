const path = require("path");
const { SlashCommandBuilder } = require("discord.js");
const { getBasicEmbed } = require("../embedCreator.js");

const command = new SlashCommandBuilder()
.setName(path.basename(__filename).replace(".js", ""))
.setDescription("Replays song from history ✨")
.addIntegerOption(option =>
    option.setName("index")
    .setRequired(true)
    .setDescription("Type index of songs you want to replay.. ✏️")
    .setMinValue(1));

const help = {
    section: "Commands 💬",
    description: command.description,
    message: `Section: \`${path.basename(__filename).replace(".js", "")}\`..\n> ${command.description} via argument:\n> - With __index__ you can replay specific song from history!\n\nREQUIREMENT: Queue has to be playing and history has to be set!\nTIP: The index argument is required!`
};

function process(client, int){
    if (!client.distube.getQueue(int))
        int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nMy **queue is empty**, **add songs** to it first!`)] });
    else{
        if (int.options.getInteger("index") > client.distube.getQueue(int).previousSongs.length)
            int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nThere is not a any song **with this index** in history!`)] });
        else{
            const song = client.distube.getQueue(int).previousSongs[int.options.getInteger("index")-1];
            client.distube.getQueue(int).songs.push(song)
            int.editReply({ embeds: [getBasicEmbed(client, "success", "(✨) Replay", `Successfully replayed song [${song.name}](${song.url}) with index \`${int.options.getInteger("index")}\`!`)] });
        }
    }
}

module.exports = {
    command,
    help,
    process
}