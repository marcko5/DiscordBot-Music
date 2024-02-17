const path = require("path");
const { SlashCommandBuilder } = require("discord.js");
const { getBasicEmbed } = require("../embedCreator.js");

const command = new SlashCommandBuilder()
.setName(path.basename(__filename).replace(".js", ""))
.setDescription("Puts song on top of the queue ⬆️")
.addIntegerOption(option =>
    option.setName("index")
    .setRequired(true)
    .setDescription("Type index of songs you want to put on top.. ✏️")
    .setMinValue(3));

const help = {
    section: "Commands 💬",
    description: command.description,
    message: `Section: \`${path.basename(__filename).replace(".js", "")}\`..\n> ${command.description} via argument:\n> - With __index__ you can top indexed song in queue!\n\nREQUIREMENT: Queue has to be playing!\nTIP: The index argument is required!`
};

function process(client, int){
    if (!client.distube.getQueue(int))
        int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nMy **queue is empty**, **add songs** to it first!`)] });
    else{
        if (int.options.getInteger("index") > client.distube.getQueue(int).songs.length)
            int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nThere is not a any song **with this index** in queue!`)] });
        else{
            const songs = client.distube.getQueue(int).songs;
            var song = songs.splice(int.options.getInteger("index")-1, 1)[0];
            var result = [ ];
            client.distube.getQueue(int).songs.forEach(x => {
                if (client.distube.getQueue(int).songs.indexOf(x) == 1)
                    result.push(song);
                result.push(x);
            })
            client.distube.getQueue(int).songs = result;
            int.editReply({ embeds: [getBasicEmbed(client, "success", "(⬆️) Top", `Successfully put song [${song.name}](${song.url}) with index \`${int.options.getInteger("index")}\` to the top of the queue!`)] });
        }
    }
}

module.exports = {
    command,
    help,
    process
}