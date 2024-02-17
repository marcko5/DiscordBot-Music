const path = require("path");
const { SlashCommandBuilder } = require("discord.js");
const { getBasicEmbed } = require("../embedCreator.js");
const { client } = require("../index.js");

function getFilters(){
    return Object.entries(client.distube.filters).map(([name, value]) => ({ name: name, value: name }));
}

const command = new SlashCommandBuilder()
.setName(path.basename(__filename).replace(".js", ""))
.setDescription("Sets queue's filter 📦")
.addStringOption(option =>
    option.setName("mode")
    .setRequired(true)
    .setDescription("Type enabled, clear or certain filter.. ✏️")
    .addChoices(
        { name: "enabled", value: "enabled" },
        { name: "clear", value: "clear" },
        ...getFilters()
    ));

const help = {
    section: "Commands 💬",
    description: command.description,
    message: `Section: \`${path.basename(__filename).replace(".js", "")}\`..\n> ${command.description} via arguments:\n> - With __enabled__ you can see all enabled filters!\n> - With __clear__ argument you can clear all filters!\n> - With __<filter's_name>__ you can toggle <filter's_name> state!\n\nREQUIREMENT:  Queue has to be playing!\nTIP: You have to set one of these arguments!`
};

function process(client, int){
    if (!client.distube.getQueue(int))
        int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nMy **queue is empty**, **add songs** to it first!`)] });
    else{
        if (int.options.getString("mode") == "enabled"){
            if (client.distube.getQueue(int).filters.size == 0)
                int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nThere aren't **any filters set** to queue!`)] });
            else{
                var text = "";
                client.distube.getQueue(int).filters.names.forEach(filter => {
                    text += `\n> ${filter}`
                });
                int.editReply({ embeds: [getBasicEmbed(client, "success", "(📦) Filter", `Current filter(s):${text}`)] });
            }
        }
        else if (int.options.getString("mode") == "clear"){
            if (client.distube.getQueue(int).filters.size == 0)
                int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nThere aren't **any filters set** to queue!`)] });
            else{
                client.distube.getQueue(int).filters.clear();
                int.editReply({ embeds: [getBasicEmbed(client, "success", "(📦) Filter", `Enabled filters were cleared!`)] });
            }
        }
        else{
            if (client.distube.getQueue(int).filters.has(int.options.getString("mode"))){
                client.distube.getQueue(int).filters.remove(int.options.getString("mode"));
                int.editReply({ embeds: [getBasicEmbed(client, "success", "(📦) Filter", `Filter \`${int.options.getString("mode")}\` was removed!`)] });
            }
            else{
                client.distube.getQueue(int).filters.add(int.options.getString("mode"));
                int.editReply({ embeds: [getBasicEmbed(client, "success", "(📦) Filter", `Filter \`${int.options.getString("mode")}\` was added!`)] });
            }
        }
    }
}

module.exports = {
    command,
    help,
    process
}