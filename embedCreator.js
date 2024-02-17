const { EmbedBuilder } = require("discord.js");

function getRandomColor(){
    const colors = ["Aqua", "DarkAqua", "DarkGreen", "Blue", 
        "DarkBlue", "Purple", "DarkPurple", "LuminousVividPink", 
        "DarkVividPink", "Gold", "DarkGold", "Orange", 
        "DarkOrange", "DarkRed", "Navy", "DarkNavy"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}
function getFormattedNumber(string){
    return string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
function getFormattedTime(number){
    if (!isNaN(number)){
        var minutes = Math.floor(number / 60);
        var hours = Math.floor(minutes / 60);
        minutes = minutes - hours * 60;
        var seconds = number - hours * 3600 - minutes * 60;
        return `${hours > 0 ? hours > 9 ? `${hours}:` : `0${hours}:` : ""}${minutes > 9 ? `${minutes}:` : `0${minutes}:`}${seconds > 9 ? `${seconds}` : `0${seconds}`}`;
    }
    return "00:00";
}
function getSplittedQueue(queue){
    var output = [];
    for (var i = 0; i < queue.songs.length; i += 30){
        output.push(queue.songs.slice(i, i+30));
    }
    return output;
}

function getBasicEmbed(client, mode, title, text){
    if (mode == "error"){
        return new EmbedBuilder()
        .setColor("Red")
        .setTitle(title)
        .setDescription(text)
        .setTimestamp()
        .setFooter({ text: `Maybe try /help for help! 💡`, iconURL: client.user.displayAvatarURL() });
    }
    else if (mode == "success"){
        return new EmbedBuilder()
        .setColor("Green")
        .setTitle(title)
        .setDescription(text)
        .setTimestamp()
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });
    }
    else if (mode == "warning"){
        return new EmbedBuilder()
        .setColor("Yellow")
        .setTitle(title)
        .setDescription(text)
        .setTimestamp()
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });
    }
    else if (mode == "random"){
        return new EmbedBuilder()
        .setColor(getRandomColor())
        .setTitle(title)
        .setDescription(text)
        .setTimestamp()
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });
    }
}

function getDistubeEmbed(client, mode, queue, song){
    if (mode == "playSong"){
        return new EmbedBuilder()
        .setColor(getRandomColor())
        .setTitle(`(▶️) Playing New Song`)
        .addFields(
            { name: " ", value: `[${song.name}](${song.url})`},
            { name: " ", value: "၊၊II၊I။IIII။‌‌‌‌‌၊၊II၊I။IIII။‌‌‌‌‌၊I၊၊III၊I။II၊I။II။‌‌‌‌‌၊I၊၊II၊I၊I။I၊I။IIII။‌‌‌‌‌၊I"},
            { name: " ", value: `${queue.formattedCurrentTime} ─────●───────────── ${song.formattedDuration}`},
            { name: " ", value: `By: ${song.member}`}
        )
        .setImage(song.thumbnail)
        .setTimestamp()
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });
    }
    else if (mode == "addSong"){
        return new EmbedBuilder()
        .setColor(getRandomColor())
        .setTitle(`(✨) Adding New Song`)
        .addFields(
            { name: " ", value: `[${song.name}](${song.url})`},
            { name: " ", value: `👀: ${getFormattedNumber(song.views)}`},
            { name: " ", value: `00:00 ─────●───────────── ${song.formattedDuration}`},
            { name: " ", value: `By: ${song.member}`}
        )
        .setImage(song.thumbnail)
        .setTimestamp()
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });
    }
    else if (mode == "addList"){
        return new EmbedBuilder()
        .setColor(getRandomColor())
        .setTitle(`(✨) Adding New List`)
        .addFields(
            { name: " ", value: `[${song.name}](${song.url})`},
            { name: " ", value: `00:00 ─────●───────────── ${song.formattedDuration}`},
            { name: " ", value: `By: ${song.member}`}
        )
        .setImage(song.thumbnail)
        .setTimestamp()
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });
    }
    else if (mode == "searchResultSong"){
        var text = song
        .map((song, i) => `[**${i+1}**] [${song.name}](${song.url}) (\`${song.formattedDuration}\`) <${song.uploader.name}>`)
        .join("\n");
        return new EmbedBuilder()
        .setColor(getRandomColor())
        .setTitle(`(🔎) Search Result [Songs]`)
        .setDescription(text)
        .setTimestamp()
        .setFooter({ text: "Choose one from above or type cancel! (30s)  💡", iconURL: client.user.displayAvatarURL() });
    }
    else if (mode == "searchResultList"){
        var text = song
        .map((song, i) => `[**${i+1}**] [${song.name}](${song.url}) <${song.uploader.name}>`)
        .join("\n");
        return new EmbedBuilder()
        .setColor(getRandomColor())
        .setTitle(`(🔎) Search Result [Playlists]`)
        .setDescription(text)
        .setTimestamp()
        .setFooter({ text: "Choose one from above or type cancel! (30s) 💡", iconURL: client.user.displayAvatarURL() });
    }
    else if (mode == "empty"){
        return new EmbedBuilder()
        .setColor("Red")
        .setTitle("(🌌) Empty Queue")
        .setDescription("My **queue is empty**, so I'm leaving!")
        .setTimestamp()
        .setFooter({ text: `Maybe try /help for help! 💡`, iconURL: client.user.displayAvatarURL() });
    }
    else if (mode == "finish"){
        return new EmbedBuilder()
        .setColor("Red")
        .setTitle("(🏁) Finished Queue")
        .setDescription("I've **finished my queue**, so I'm leaving!")
        .setTimestamp()
        .setFooter({ text: `Maybe try /help for help! 💡`, iconURL: client.user.displayAvatarURL() });
    }
    else if (mode == "error"){
        console.log(`!ERROR! While processing DisTube\n${queue}\n`);
        return new EmbedBuilder()
        .setColor("Red")
        .setTitle("(❌) Error")
        .setDescription("Some **unknown error** occured!")
        .setTimestamp()
        .setFooter({ text: `Maybe try /help for help! 💡`, iconURL: client.user.displayAvatarURL() });
    }
    else if (mode == "sendQueue"){
        var output = [];
        var splitted = getSplittedQueue(queue);
        for (var i = 0; i < splitted.length; i++){
            var songs = splitted[i];
            var text = songs
            .map((s, j) => `[**${j+1+(i)*30}**] [${s.name}](${s.url}) (\`${s.formattedDuration}\`) <${s.member}>`)
            .join("\n");
            if (i == 0){
                output.push(new EmbedBuilder()
                .setColor(getRandomColor())
                .setTitle(`(📄) Queue${splitted.length > 1 ? ` (${i+1}/${splitted.length})` : ""}`)
                .setDescription(`**Currently Playing**:\n> 🌐: [${song.name}](${song.url})\n> 🕒: \`${queue.formattedCurrentTime}\` - ${song.formattedDuration}\n> 👀: ${song.views ? getFormattedNumber(song.views) : "Hidden"}\n> 👤: ${song.member}\n\n**Queue Informations**:\n> ${queue.playing ? "▶️: Playing" : "⏸️: Paused"}\n> 🔁: Repeat ${queue.repeatMode == 0 ? "Off" : queue.repeatMode == 1 ? "Song" : "Queue"}\n> 🤖: Autoplay ${queue.autoplay ? "On" : "Off"}\n> 🕒: \`${queue.formattedCurrentTime}\` - ${queue.formattedDuration}\n> 🔊: ${queue.volume}%${queue.filters.size > 0 ? `\n> 📦: ${queue.filters.names.join(", ")}` : ""}${songs.length > 1 ? `\n\n${text}` : ""}`)
                .setTimestamp()
                .setImage(song.thumbnail)
                .setFooter({ text: `Maybe try /help for help! 💡`, iconURL: client.user.displayAvatarURL() }))
            }
            else{
                output.push(new EmbedBuilder()
                .setColor(getRandomColor())
                .setTitle(`(📄) Queue (${i+1}/${splitted.length})`)
                .setDescription(`${text}`)
                .setTimestamp()
                .setFooter({ text: `Maybe try /help for help! 💡`, iconURL: client.user.displayAvatarURL() }))
            }
        }
        return output;
    }
    else if (mode == "sendPlaying"){
        return new EmbedBuilder()
        .setColor(getRandomColor())
        .setTitle(`(▶️) Playing`)
        .setDescription(`**Currently Playing**:\n> 🌐: [${song.name}](${song.url})\n> 🕒: \`${queue.formattedCurrentTime}\` - ${song.formattedDuration}\n> 👀: ${song.views ? getFormattedNumber(song.views) : "Hidden"}\n> 👤: ${song.member}\n\n**Queue Informations**:\n> ${queue.playing ? "▶️: Playing" : "⏸️: Paused"}\n> 🔁: Repeat ${queue.repeatMode == 0 ? "Off" : queue.repeatMode == 1 ? "Song" : "Queue"}\n> 🤖: Autoplay ${queue.autoplay ? "On" : "Off"}\n> 🕒: \`${queue.formattedCurrentTime}\` - ${queue.formattedDuration}\n> 🔊: ${queue.volume}%${queue.filters.size > 0 ? `\n> 📦: ${queue.filters.names.join(", ")}` : ""}`)
        .setTimestamp()
        .setImage(song.thumbnail)
        .setFooter({ text: `Maybe try /help for help! 💡`, iconURL: client.user.displayAvatarURL() })
    }
}

module.exports = {
    getBasicEmbed,
    getDistubeEmbed,
    getFormattedNumber,
    getFormattedTime
};