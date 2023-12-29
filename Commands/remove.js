const path = require('path');
const { SlashCommandBuilder } = require("discord.js");
const { getBasicEmbed } = require("../embedCreator.js");

const data = new SlashCommandBuilder()
.setName(path.basename(__filename).replace(".js", ""))
.setDescription("Removes song from queue 🗑️")
.addIntegerOption(option =>
    option.setName("index")
    .setRequired(true)
    .setDescription("Type index of songs you want to remove.. ✏️")
    .setMinValue(1))

function execute(client, int){
    if (!client.distube.getQueue(int))
        int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nMy **queue is empty**, **add songs** to it first!`)] });
    else{
        if (int.options.getInteger("index") > client.distube.getQueue(int).songs.length)
            int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nThere is not a any song **with this index** in queue!`)] });
        else{
            const songs = client.distube.getQueue(int).songs;
            var song = client.distube.getQueue(int).songs[int.options.getInteger("index")-1];
            if (songs.length == 1)
                client.distube.getQueue(int).stop();
            else if (int.options.getInteger("index") == 1)
                client.distube.jump(int, 1);
            else{
                songs.splice(int.options.getInteger("index")-1, 1);
                client.distube.getQueue(int).songs = songs;
            }
            int.editReply({ embeds: [getBasicEmbed(client, "success", "(🗑️) Remove", `Successfully removed song [${song.name}](${song.url}) with index \`${int.options.getInteger("index")}\`!`)] });
        }
    }
}

module.exports = {
    data,
    execute
}