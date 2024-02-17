const path = require("path");
const fs = require("fs");
const { SlashCommandBuilder, ChannelType } = require("discord.js");
const { getBasicEmbed } = require("../embedCreator.js");

const command = new SlashCommandBuilder()
.setName(path.basename(__filename).replace(".js", ""))
.setDescription("Sets up default channels 🚧")
.addChannelOption(option =>
    option.setName("command")
    .setDescription("Choose main command channel.. ✏️")
    .setRequired(true)
    .addChannelTypes(ChannelType.GuildText))
.addChannelOption(option =>
    option.setName("info")
    .setDescription("Choose main info channel.. ✏️")
    .setRequired(true)
    .addChannelTypes(ChannelType.GuildText));

const help = {
    section: "Commands 💬",
    description: command.description,
    message: `Section: \`${path.basename(__filename).replace(".js", "")}\`..\n> ${command.description} via arguments:\n> - With __command__ you can set main command channel!\n> - With __info__ you can set main info channel!\n\nREQUIREMENT: You have to have ADMINISTRATOR permission!\nTIP: Set this before using me!`
};

function process(client, int){
    if (!int.member.permissions.has("ADMINISTRATOR"))
        int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nYou have to be **ADMINISTRATOR** to use this command!`)] });
    else{
        var rooms = JSON.parse(fs.readFileSync("Configs/rooms.json", "utf-8"));
        rooms[int.guild.id] = {
            command: int.options.getChannel("command").id,
            info: int.options.getChannel("info").id,
            errorSent: false
        }
        try{
            fs.writeFileSync("Configs/rooms.json", JSON.stringify(rooms, null, 2), "utf-8");
            int.editReply({ embeds: [getBasicEmbed(client, "success", "(🚧) Setup", `I've been **successfully set up** on this server!\n\nMain command room is ${int.options.getChannel("command")}\nMain info room is ${int.options.getChannel("info")}`)] });
        }
        catch{
            int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nCould **not save** configuration!`)] });
        }
    }
}

module.exports = {
    command,
    help,
    process
}