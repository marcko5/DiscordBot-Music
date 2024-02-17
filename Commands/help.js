const path = require("path");
const { SlashCommandBuilder } = require("discord.js");
const { getBasicEmbed } = require("../embedCreator.js");
const { client } = require("../index.js");

function getCommands(){
    var output = [];
    for (const [name, value] of client.commands.entries()) {
        output.push(name);
    }
    return output;
}

const command = new SlashCommandBuilder()
.setName(path.basename(__filename).replace(".js", ""))
.setDescription("Shows info about author 🛡️")
.addStringOption(option =>
    option.setName("command")
    .setDescription("Type command for specified help.. ✏️")
    .setRequired(false)
    .addChoices(...getCommands().map((x) => ({ name: x, value: x }))));

/*const help = {
    section: "Info 📢",
    description: command.description,
    message: `Section: \`${path.basename(__filename).replace(".js", "")}\`..\n> ${command.description}!`
};*/

function process(client, int){
    if (!int.options.getString("command")){
        var commands = { };
        for (const [name, value] of client.commands.entries()) {
            if (!commands[value.help.section])
                commands[value.help.section] = [];
            commands[value.help.section].push({ name: name, description: value.help.description });
        }
        var text = "";
        for (const [section, value] of Object.entries(commands)){
            text += `\n\n**${section}**:`;
            for (const command of value){
                text += `\n> - \`${command.name}\` → ${command.description}`;
            }
        }
        int.editReply({ embeds: [getBasicEmbed(client, "success", "(💡) Help", text)] });
    }
    else{
        if (getCommands().indexOf(int.options.getString("command")) > -1)
            int.editReply({ embeds: [getBasicEmbed(client, "warning", "(💡) Help", client.commands.get(int.options.getString("command")).help.message)] });
        else
            int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nCommand **${int.options.getString("command")}** was not found!`)] });
    }
}

module.exports = {
    command,
    //help,
    process
}