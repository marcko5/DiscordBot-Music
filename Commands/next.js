const path = require("path");
const { SlashCommandBuilder } = require("discord.js");
const { getBasicEmbed } = require("../embedCreator.js");

const command = new SlashCommandBuilder()
.setName(path.basename(__filename).replace(".js", ""))
.setDescription("Skips to next song ⏩")

const help = {
    section: "Commands 💬",
    description: command.description,
    message: `Section: \`${path.basename(__filename).replace(".js", "")}\`..\n> ${command.description}!\n\nREQUIREMENTS: Queue has to be playing & Next song has to be listed in queue!`
};

function process(client, int){
    if (!client.distube.getQueue(int))
        int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nMy **queue is empty**, **add songs** to it first!`)] });
    else{
        if (client.distube.getQueue(int).songs.lenght == 1)
            int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nThere **is not a next song** in queue!`)] });
        else{
            client.distube.getQueue(int).skip();
            int.editReply({ embeds: [getBasicEmbed(client, "success", "(⏩) Next", `Playing next song by ${int.member}!`)] });
        }
    }
}

module.exports = {
    command,
    help,
    process
}