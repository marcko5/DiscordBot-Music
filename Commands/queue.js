const path = require("path");
const { SlashCommandBuilder } = require("discord.js");
const { getBasicEmbed, getDistubeEmbed } = require("../embedCreator.js");

const command = new SlashCommandBuilder()
.setName(path.basename(__filename).replace(".js", ""))
.setDescription("Shows current queue 📄");

const help = {
    section: "Info 📢",
    description: command.description,
    message: `Section: \`${path.basename(__filename).replace(".js", "")}\`..\n> ${command.description}!\n\nREQUIREMENT: Queue has to be playing!`
};

async function process(client, int){
    if (!client.distube.getQueue(int)){
        int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nMy **queue is empty**, **add songs** to it first!`)] });
    }
    else{
        var outputs = await getDistubeEmbed(client, "sendQueue", client.distube.getQueue(int), client.distube.getQueue(int).songs[0]);
        for (var i = 0; i < outputs.length; i++){
            var output = outputs[i];
            if (Array.prototype.indexOf(output, outputs) == 0)
                await int.editReply({ embeds: [output] });
            else
                await int.followUp({ embeds: [output] });
        }
    }
}

module.exports = {
    command,
    help,
    process
}