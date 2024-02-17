const path = require("path");
const { SlashCommandBuilder } = require("discord.js");
const { getBasicEmbed } = require("../embedCreator.js");

const command = new SlashCommandBuilder()
.setName(path.basename(__filename).replace(".js", ""))
.setDescription("Resumes current queue ▶️")

const help = {
    section: "Commands 💬",
    description: command.description,
    message: `Section: \`${path.basename(__filename).replace(".js", "")}\`..\n> ${command.description}!\n\nREQUIREMENT: Queue has to be playing!`
};

function process(client, int){
    if (!client.distube.getQueue(int))
        int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nMy **queue is empty**, **add songs** to it first!`)] });
    else{
        if (client.distube.getQueue(int).playing)
            int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nMy **queue is already** playing!`)] });
        else{
            client.distube.getQueue(int).resume();
            int.editReply({ embeds: [getBasicEmbed(client, "success", "(▶️) Resume", `Queue was successfully resumed by ${int.member}!`)]});
        }
    }
}

module.exports = {
    command,
    help,
    process
}