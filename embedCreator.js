const { EmbedBuilder } = require('discord.js');

function getBasicEmbed(client, mode, title, text){
    if (mode == "error"){
        return new EmbedBuilder()
            .setColor("Red")
            .setTitle(title)
            .setDescription(text)
            .setTimestamp()
            .setFooter({ text: "Maybe try /help for help! 💡", iconURL: client.user.displayAvatarURL() });
    }
    else if (mode == "random"){
        return new EmbedBuilder()
            .setColor("Random")
            .setTitle(title)
            .setDescription(text)
            .setTimestamp()
            .setFooter({ text: "Maybe try /help for help! 💡", iconURL: client.user.displayAvatarURL() });
    }
}


module.exports = {
    getBasicEmbed
};