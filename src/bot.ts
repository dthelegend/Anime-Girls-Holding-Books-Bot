import Discord from 'discord.js';
import fs from 'fs';
import express from 'express';

const PORT : number = (process.env.PORT && +process.env.PORT) || 3000

const client = new Discord.Client();
const app : express.Application = express();

const banlist = ["Memes", "Uncategorized",".git", "Other", "Personification"];
const substitutes : {[l : string]: string} = {"Go":"Golang", "V":"VLang"};

function substitute(name : string) : string {
    return substitutes[name] || name;
}

async function search(message : string) : Promise<Discord.MessageAttachment | undefined> {
    // console.log("Searching for image in message:\n" + message);
    const images_fs : fs.Dirent[] = fs.readdirSync('./images', { "withFileTypes":true });
    for(const folder of images_fs.filter(x => x.isDirectory() && !banlist.includes(x.name))) {
        // console.log("Checking Folder: " + folder.name);
        const language_regex = new RegExp(`(?<=[^A-Z'+]|^)${substitute(folder.name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=[^A-Z+]|$)`, 'gi');
        if(language_regex.test(message)) {
            const language_fs : fs.Dirent[] = fs.readdirSync(`./images/${folder.name}`, { "withFileTypes":true }).filter(x => x.isFile());
            const file = `./images/${folder.name}/${language_fs[Math.floor(Math.random() * language_fs.length)].name}`
            // console.log(file);
            return new Discord.MessageAttachment(file);
        }
    }
    return undefined;
}

client.on('ready', () => {
    console.log('Big wheel keep on turnin\'');
});

client.on('message', (message) => {
    if(message.author.bot) return;
    search(message.content)
    .then(attachment => {
        if(attachment) message.channel.send('', attachment);
    })
    .catch(err => console.error("There has been an error in search:\n" + err))
})

app.get('*', (_req, res) => {
    res.redirect('https://www.youtube.com/watch?v=-51AfyMqnpI');
});

/* START */
client.login(process.env.DISCORD_TOKEN).catch((err) => console.error("There has been an error on login:\n" + err));

app.listen(PORT, () => {
    console.log('Proud Mary keep on burnin\'');
});