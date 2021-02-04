import Discord from 'discord.js';
import fs from 'fs';
import express from 'express';

const PORT : number = parseInt(process.env.PORT, 10) || 3000

const client = new Discord.Client();
const app : express.Application = express();

const banlist = ["Memes", "Uncategorized",".git", "Other", "Personification"];

async function search(message : string) : Promise<Discord.MessageAttachment> {
    const images_fs : fs.Dirent[] = fs.readdirSync('./images', { "withFileTypes":true });
    for(const folder of images_fs.filter(x => x.isDirectory() && !banlist.includes(x.name))) {
        const language_regex = new RegExp(`(?<=[^A-Z'+]|^)${folder.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=[^A-Z+]|$)`, 'gi');
        if(language_regex.test(message)) {
            const language_fs : fs.Dirent[] = fs.readdirSync(`./images/${folder.name}`, { "withFileTypes":true }).filter(x => x.isFile());
            const file = `./images/${folder.name}/${language_fs[Math.floor(Math.random() * language_fs.length)].name}`
            console.log(file);
            return new Discord.MessageAttachment(file);
        }
    }
    return undefined;
}

client.on('ready', () => {
    console.log('Big wheel keep on turnin\'');
});

client.on('message', (message) => {
    if(!message.guild || message.author.bot) return;
    search(message.content)
    .then(attachment => {
        if(attachment) message.channel.send('', attachment);
    })
})

app.get('*', (req, res) => {
    res.redirect('https://www.youtube.com/watch?v=-51AfyMqnpI');
});

/* START */
client.login(process.env.DISCORD_TOKEN);

app.listen(PORT, () => {
    console.log('Proud Mary keep on burnin\'');
});