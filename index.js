require("dotenv").config();
const token = process.env.TOKEN;
const clientid = process.env.CLIENTID;
const guildid = process.env.GUILDID;

const fs = require("fs");

const Discord = require("discord.js");
const { Client, Events, GatewayIntentBits, Collection, REST, Routes } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildModeration] });

const { DisTube } = require("distube");
const { DeezerPlugin } = require("@distube/deezer");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { getBasicEmbed, getDistubeEmbed } = require("./embedCreator");
const distube = new DisTube(client, {
    nsfw: true,
    leaveOnEmpty: true,
    leaveOnFinish: true,
    leaveOnStop: true,
    savePreviousSongs: true,
    plugins: [new DeezerPlugin(), new SpotifyPlugin({ emitEventsAfterFetching: true }), new SoundCloudPlugin(), new YtDlpPlugin({ update: false })]
});
client.distube = distube;

client.on(Events.InteractionCreate, async (int) => {
    if (!int.user.bot && int.isCommand){
        await int.deferReply();
        if (int.commandName == "setup"){
            const command = client.commandsInfo.get(int.commandName);
            if (command){
                try{
                    await command.execute(client, int);
                }
                catch(err){
                    await int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${int.commandName}** an error occured..\nAnyway, **try again** later!`)] });
                    console.log(`!ERROR! While processing ${int.commandName} command\n${err}\n`);
                }
            }
        }
        else{
            var rooms = JSON.parse(fs.readFileSync("Configs/rooms.json", "utf-8"));
            if (!(int.guild.id.toString() in rooms)){
                await int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${int.commandName}** an error occured..\nDefault **rooms weren't** prepared!`)] });
                console.log(`!ERROR! While processing ${int.commandName} command\nROOMS_NOT_SET: JSON rooms didn't contain this guild!\n`);
                rooms[int.guild.id] = {
                    errorSent: true
                }
                fs.writeFileSync("Configs/rooms.json", JSON.stringify(rooms, null, 2), "utf-8");
            }
            else if (int.guild.id.toString() in rooms){
                if (!("command" in rooms[int.guild.id])){
                    await int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${int.commandName}** an error occured..\nDefault room for **commands wasn't** prepared!`)] });
                    if (!rooms[int.guild.id].errorSent){
                        console.log(`!ERROR! While processing ${int.commandName} command\nROOMS_NOT_SET: JSON room with element for command didn't contain this guild!\n`);
                        rooms[int.guild.id].errorSent = true;
                        fs.writeFileSync("Configs/rooms.json", JSON.stringify(rooms, null, 2), "utf-8");
                    } 
                }
                else if (!("info" in rooms[int.guild.id])){
                    await int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${int.commandName}** an error occured..\nDefault room for **info wasn't** prepared!`)] });
                    if (!rooms[int.guild.id].errorSent){
                        console.log(`!ERROR! While processing ${int.commandName} command\nROOMS_NOT_SET: JSON room with element for info didn't contain this guild!\n`);
                        rooms[int.guild.id].errorSent = true;
                        fs.writeFileSync("Configs/rooms.json", JSON.stringify(rooms, null, 2), "utf-8");
                    }
                }
                else{
                    const checkCommand = int.guild.channels.cache.has(rooms[int.guild.id].command);
                    const checkInfo = int.guild.channels.cache.has(rooms[int.guild.id].info);
                    if (!checkCommand){
                        await int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${int.commandName}** an error occured..\nDefault room for **commands wasn't** prepared!`)] });
                        if (!rooms[int.guild.id].errorSent){
                            console.log(`!ERROR! While processing ${int.commandName} command\nROOMS_NOT_SET: JSON room with element for command didn't contain this guild!\n`);
                            rooms[int.guild.id].errorSent = true;
                            fs.writeFileSync("Configs/rooms.json", JSON.stringify(rooms, null, 2), "utf-8");
                        } 
                    }
                    else if (!checkInfo){
                        await int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${int.commandName}** an error occured..\nDefault room for **info wasn't** prepared!`)] });
                        if (!rooms[int.guild.id].errorSent){
                            console.log(`!ERROR! While processing ${int.commandName} command\nROOMS_NOT_SET: JSON room with element for info didn't contain this guild!\n`);
                            rooms[int.guild.id].errorSent = true;
                            fs.writeFileSync("Configs/rooms.json", JSON.stringify(rooms, null, 2), "utf-8");
                        }
                    }
                    else{
                        if (int.channel.id != rooms[int.guild.id].command)
                            await int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${int.commandName}** an error occured..\nYou **typed into wrong** channel!`)] });
                        else{
                            const command = client.commandsInfo.get(int.commandName);
                            if (command){
                                try{
                                    await command.execute(client, int);
                                }
                                catch(err){
                                    await int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${int.commandName}** an error occured..\nAnyway, **try again** later!`)] });
                                    console.log(`!ERROR! While processing ${int.commandName} command\n${err}\n`);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
});

client.on(Events.MessageCreate, (msg) => {
    if (!msg.author.bot){
        var cache = JSON.parse(fs.readFileSync("Configs/cache.json", "utf-8"));
        if (!isNaN(msg.content) || msg.content == "cancel"){
            if (msg.guild.id.toString() in cache){
                if (msg.author.id.toString() in cache[msg.guild.id]){
                    var rooms = JSON.parse(fs.readFileSync("Configs/rooms.json", "utf-8"));
                    if (!(msg.guild.id.toString() in rooms)){
                        msg.reply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **search request** an error occured..\nDefault **rooms weren't** prepared!`)], ephemeral: true });
                        msg.react("❌");
                        console.log(`!ERROR! While processing search request\nROOMS_NOT_SET: JSON rooms didn't contain this guild!\n`);
                        rooms[msg.guild.id] = {
                            errorSent: true
                        }
                        fs.writeFileSync("Configs/rooms.json", JSON.stringify(rooms, null, 2), "utf-8");
                    }
                    else{
                        if (!("command" in rooms[msg.guild.id])){
                            msg.reply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **search request** an error occured..\nDefault room for **commands wasn't** prepared!`)], ephemeral: true });
                            msg.react("❌");
                            if (!rooms[msg.guild.id].errorSent){
                                console.log(`!ERROR! While processing search request\nROOMS_NOT_SET: JSON room with element for command didn't contain this guild!\n`);
                                rooms[msg.guild.id].errorSent = true;
                                fs.writeFileSync("Configs/rooms.json", JSON.stringify(rooms, null, 2), "utf-8");
                            } 
                        }
                        else if (!("info" in rooms[msg.guild.id])){
                            msg.reply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **search request** an error occured..\nDefault room for **info wasn't** prepared!`)], ephemeral: true });
                            msg.react("❌");
                            if (!rooms[msg.guild.id].errorSent){
                                console.log(`!ERROR! While processing search request\nROOMS_NOT_SET: JSON room with element for info didn't contain this guild!\n`);
                                rooms[msg.guild.id].errorSent = true;
                                fs.writeFileSync("Configs/rooms.json", JSON.stringify(rooms, null, 2), "utf-8");
                            }
                        }
                        else{
                            const checkCommand = msg.guild.channels.cache.has(rooms[msg.guild.id].command);
                            const checkInfo = msg.guild.channels.cache.has(rooms[msg.guild.id].info);
                            if (!checkCommand){
                                msg.reply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **search request** an error occured..\nDefault room for **commands wasn't** prepared!`)], ephemeral: true });
                                msg.react("❌");
                                if (!rooms[msg.guild.id].errorSent){
                                    console.log(`!ERROR! While processing search request\nROOMS_NOT_SET: JSON room with element for command didn't contain this guild!\n`);
                                    rooms[msg.guild.id].errorSent = true;
                                    fs.writeFileSync("Configs/rooms.json", JSON.stringify(rooms, null, 2), "utf-8");
                                } 
                            }
                            else if (!checkInfo){
                                msg.reply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **search request** an error occured..\nDefault room for **info wasn't** prepared!`)], ephemeral: true });
                                msg.react("❌");
                                if (!rooms[msg.guild.id].errorSent){
                                    console.log(`!ERROR! While processing search request\nROOMS_NOT_SET: JSON room with element for info didn't contain this guild!\n`);
                                    rooms[msg.guild.id].errorSent = true;
                                    fs.writeFileSync("Configs/rooms.json", JSON.stringify(rooms, null, 2), "utf-8");
                                }
                            }
                            else{
                                if (msg.channel.id != rooms[msg.guild.id].command){
                                    msg.reply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **search request** an error occured..\nYou **typed into wrong** channel!`)], ephemeral: true });
                                    msg.react("❌");
                                }
                                else{
                                    if (msg.content == "cancel"){
                                        delete cache[msg.guild.id][msg.member.id];
                                        fs.writeFileSync("Configs/cache.json", JSON.stringify(cache, null, 2), "utf-8");
                                        msg.reply({ embeds: [getBasicEmbed(client, "error", "(♻️) Canceled", `You searching request was canceled!`)] });
                                        msg.react("♻️");
                                    }
                                    else{
                                        var num = parseInt(msg.content);
                                        if (num < 1 || num > cache[msg.guild.id][msg.author.id].result.length){
                                            msg.reply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **search request** an error occured..\nYou **typed wrong** answer!`)], ephemeral: true });
                                            msg.react("❌");
                                        }
                                        else{
                                            var voiceChannel;
                                            if (client.distube.getQueue(msg) != undefined)
                                                voiceChannel = client.distube.getQueue(msg).voiceChannel; 
                                            else
                                                voiceChannel = msg.member.voice.channel;
                                            client.distube.play(voiceChannel, cache[msg.guild.id][msg.member.id].result[num-1], { member: msg.member, textChannel: msg.channel });
                                            //msg.reply({ embeds: [getDistubeEmbed(client, "addSong", distube.getQueue(msg), cache[msg.guild.id][msg.member.id].result[num-1])] })
                                            msg.react("✅");
                                            delete cache[msg.guild.id][msg.member.id];
                                            fs.writeFileSync("Configs/cache.json", JSON.stringify(cache, null, 2), "utf-8");
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
});

const rest = new REST().setToken(token);
client.commandsInfo = new Collection();
async function loadCommands(){
    const commands = [];
    for (const file of fs.readdirSync("./Commands")){
        delete require.cache[require.resolve(`./Commands/${file}`)];
        const command = require(`./Commands/${file}`);
        if ("data" in command){
            await commands.push(command.data.toJSON());
            await client.commandsInfo.set(command.data.name, command);
        }
    }
    await console.log(`Loading ${commands.length} command(s)..`);
    var error = false;
    /*client.guilds.cache.forEach(async guild => {
        await rest.put(Routes.applicationGuildCommands(clientid, guild.id), { body: [] }).catch(async err => {
            await console.log(`!ERROR! While erasing commands on specific guild ${guild.name} [${guild.id}]..\n${err}`);
            error = true;
        });
    });
    await rest.put(Routes.applicationCommands(clientid), { body: [] }).catch(async err => {
        await console.log(`!ERROR! While erasing commands..\n${err}`);
        error = true;
    });*/
    const data = await rest.put(Routes.applicationCommands(clientid), { body: commands }).catch(async err => {
        await console.log(`!ERROR! While loading commands..${err}`);
        error = true;
    });
    await console.log(`${error ? `\n` : `Loaded ${data.length} command(s)!\n`}`)
}

function getChannel(queue){
    var rooms = JSON.parse(fs.readFileSync("Configs/rooms.json", "utf-8"));
    if (queue.textChannel.guild.channels.cache.has(rooms[queue.textChannel.guild.id].info))
        return queue.textChannel.guild.channels.cache.get(rooms[queue.textChannel.guild.id].info);
    return queue.textChannel;
}
distube
    .on("playSong", (queue, song) => getChannel(queue).send({ embeds: [getDistubeEmbed(client, "playSong", queue, song)] }))
    .on("addSong", (queue, song) => queue.textChannel.send({ embeds: [getDistubeEmbed(client, "addSong", queue, song)] }))
    .on("addList", (queue, list) => queue.textChannel.send({ embeds: [getDistubeEmbed(client, "addList", queue, list)] }))
    .on("empty", (queue) => {
        getChannel(queue).send({ embeds: [getDistubeEmbed(client, "empty", null, null)] });
    })
    .on("finish", (queue) => {
        getChannel(queue).send({ embeds: [getDistubeEmbed(client, "empty", null, null)] });
    })
    .on("error", (queue, error) => {
        getChannel(queue).send({ embeds: [getDistubeEmbed(client, "empty", error, null)] });
        console.log(`!ERROR! Unknown DisTube\n${err}\n`)
    });

client.once(Events.ClientReady, () => {
    console.log(`\n< ${new Date(new Date().getTime())} >\n< Discord Bot ${client.user.displayName} successfully turned on! >\n`);
    client.user.setActivity("Type /help for help 💡", { type: Discord.ActivityType.STREAMING, url: "https://github.com/marcko5/DiscordBot-Music" });
    try{
        var rooms = JSON.parse(fs.readFileSync("Configs/rooms.json", "utf-8"));
        for (const [guildid, value] of Object.entries(rooms)){
            if (value.errorSent)
                value.errorSent = false;
        }
        fs.writeFileSync("Configs/rooms.json", JSON.stringify(rooms, null, 2), "utf-8");
    }
    catch{
        fs.writeFileSync("Configs/rooms.json", JSON.stringify({}, null, 2), "utf-8");
    }
    fs.writeFileSync("Configs/cache.json", JSON.stringify({}, null, 2), "utf-8");
    for(const guild in client.guilds){
        if(getVoiceConnection(guild))
            getVoiceConnection(guild).leave();
    }
    loadCommands();
});
client.login(token);

module.exports = {
    client
}