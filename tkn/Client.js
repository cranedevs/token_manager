const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const client = require('..');
const {JsonDatabase} = require("five.db");
const db = new JsonDatabase();
const {bgRed} = require("colors")
const {guildId} = require("../config.json");

/**
MIT License

Copyright (c) 2023 Crané

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

class Token extends Client {

    constructor(token, sendDMInput) {
        super({
            checkUpdate: false
        })
    
        this.on("ready", async () => {
            console.log(`${this.user.username}`.bgGreen);
            const tokenVoice = await db.fetch(`${guildId}_tokenVoice`);
            const tokenDM = await db.fetch(`${guildId}_tokenDM`);
            const tokenDeaf = await db.fetch(`${guildId}_tokenDeaf`);
            const tokenMute = await db.fetch(`${guildId}_tokenMute`);
            const tokenPresence = await db.fetch(`${guildId}_tokenPresence`);
            const tokenProfile = await db.fetch(`${guildId}_tokenProfile`);
            const tokenInviteCode = await db.fetch(`${guildId}_tokenInviteCode`);

            if(tokenPresence) {
                setInterval(() => {
                    const num = Math.floor(Math.random() * tokenPresence.length);
                    const status = tokenPresence[num];
                    this.user.setPresence({ activities: [{ name: status }] }); 
                }, 5*1000);
            }

            if(tokenInviteCode) {
                this.acceptInvite(tokenInviteCode);
                db.set(`${guildId}_tokenInviteCode`, false);
            }

            if(tokenProfile) {
                this.user.setAvatar(tokenProfile);
                db.set(`${guildId}_tokenProfile`, false);
            }

            if(tokenVoice) {
                const channel = this.channels.cache.get(tokenVoice);
                joinVoiceChannel({
                    channelId: channel.id,
                    guildId: channel.guildId,
                    adapterCreator: channel.guild.voiceAdapterCreator,
                    selfDeaf: tokenDeaf,
                    selfMute: tokenMute
                });
            }

            if(tokenDM && sendDMInput) {
                const guild = this.guilds.cache.get(tokenDM);
                guild.members.cache.forEach(async member => {
                    try {
                        if(member.user.id === this.user.id) return;
                        if(member.user.bot) return;
                        member.user.send(`${sendDMInput}`);
                        console.log(`Sended: ${member.user.username}`.bgGreen);
                    } catch (error) {
                        console.log(error.message);
                        console.log(`Not Sended: ${member.user.username}`.bgRed);
                    }
                })
                
                db.set(`${tokenDM}_tokenDM`, false);
            }
        });

        this.login(token).catch(e => console.log("Invalid Token:", token));
    }
}


module.exports = {Token};