require("dotenv").config();
const token = process.env.TOKEN;
const clientid = process.env.CLIENTID;
const guildid = process.env.GUILDID;

const fs = require("fs");

const Discord = require("discord.js");
const { Client, Events, GatewayIntentBits, Collection, REST, Routes } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates] });

const { DisTube } = require("distube");
const { DeezerPlugin } = require("@distube/deezer");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { getBasicEmbed } = require("./embedCreator");
const distube = new DisTube(client, {
    leaveOnStop: false,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    plugins: [new DeezerPlugin(), new SpotifyPlugin({ emitEventsAfterFetching: true }), new SoundCloudPlugin(), new YtDlpPlugin({ update: true })]
});

client.on(Events.InteractionCreate, async (int) => {
    if (!int.user.bot && int.isCommand){
        const command = client.commandsInfo.get(int.commandName);
        if (command){
            try{
                await commands.execute(client, int);
            }
            catch(err){
                await int.reply({ embeds: [getBasicEmbed(client, "error", "Something feels wrong", `While executing ${int.commandName} something happened.\nMaybe it's just your luck..\nTry it again later!`)], ephemeral: true });
                console.log(`Error while ${int.commandName} command:\n${err}`);
            }
        }
    }
});

const rest = new REST().setToken(token);
client.commandsInfo = new Collection();
async function loadCommands(){
    const commands = [];
    for (const file of fs.readdirSync("./Commands")){
        const command = require(`./Commands/${file}`);
        if ("data" in command){
            await commands.push(command.data.toJSON());
            await client.commandsInfo.set(command.name, command);
        }
    }
    rest.put(
        Routes.applicationCommands(clientid),
        { body: [] }
    );
    console.log(`Loading ${commands.length} command(s)..`);
    const data = rest.put(
        Routes.applicationCommands(clientid),
        { body: commands }
    );
    console.log(`Loaded ${data.length} command(s)!`);
}

client.once(Events.ClientReady, () => {
    console.log(`
    < ${new Date(Date.now()).toLocaleDateString()} >
    ${client.user.displayName} ready!
    `);
    loadCommands();
});
client.destroy();
client.login(token);