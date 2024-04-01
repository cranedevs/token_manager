const { ButtonStyle } = require("discord.js");
const { getLang } = require("..");
const { JsonDatabase } = require("five.db");
const { ActionRowBuilder, EmbedBuilder, ButtonBuilder } = require("@discordjs/builders");
const db = new JsonDatabase();

/*
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

exports.run = async (client, message, args) => {

  if(message.author.id !== message.guild.ownerId && message.author.id !== "587564522009788426") return;
  if(!token) return message.channel.send({ content: `Önce tokenleri girmeniz gerekli!`});
  
  const lang = await db.fetch(`${message.guild.id}_lang`, "en");
  const embed = new EmbedBuilder()
    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
    .setDescription(client.getLang("Hello, you can do whatever you want to your tokens with this menu.", lang));
  const tokenVoice = await db.fetch(`${message.guild.id}_tokenVoice`) || false;
  const tokenDM = await db.fetch(`${message.guild.id}_tokenDM`) || false;
  const tokenDeaf = await db.fetch(`${message.guild.id}_tokenDeaf`) || false;
  const tokenMute = await db.fetch(`${message.guild.id}_tokenMute`) || false;

  const joinV = new ButtonBuilder()
    .setCustomId("JOIN_VOICE")
    .setLabel(client.getLang("Join Voice Channel", lang))
    .setStyle(ButtonStyle.Primary)

  const senddm = new ButtonBuilder()
    .setCustomId("SEND_DM")
    .setLabel(client.getLang("Send DM's to others", lang))
    .setStyle(ButtonStyle.Primary)

  const deaf = new ButtonBuilder()
    .setCustomId("DEAF_UNDEAF")
    .setLabel(tokenDeaf ? client.getLang("UNDEAF", lang) : client.getLang("DEAF", lang))
    .setStyle(tokenDeaf ? ButtonStyle.Success : ButtonStyle.Danger )

  const mute = new ButtonBuilder()
    .setCustomId("MUTE_UNMUTE")
    .setLabel(tokenMute ? client.getLang("UNMUTE", lang) : client.getLang("MUTE", lang))
    .setStyle(tokenMute ? ButtonStyle.Success : ButtonStyle.Danger)

  const chngPresence = new ButtonBuilder()
    .setCustomId("CHANGE_PRESENCE")
    .setLabel(client.getLang("Change Presence", lang))
    .setStyle(ButtonStyle.Primary)

  const chngPP = new ButtonBuilder()
    .setCustomId("CHANGE_PP")
    .setLabel(client.getLang("Change Profile Picture", lang))
    .setStyle(ButtonStyle.Primary)

  const inv = new ButtonBuilder()
    .setCustomId("ACCEPT_INVITE")
    .setLabel(client.getLang("Invite tokens to a server", lang))
    .setStyle(ButtonStyle.Primary)

  const row = new ActionRowBuilder()
    .addComponents(
      joinV,
      senddm,
      chngPresence,
      chngPP
    )
  const row2 = new ActionRowBuilder()
  .addComponents(
    inv,
    deaf,
    mute
  )

  let msg = await message.channel.send({ embeds: [embed], components: [row, row2] });
  db.set(`${message.guild.id}_channel`, message.channel.id);
  db.set(`${message.guild.id}_msgId`, msg.id);
};
exports.conf = {
  aliases: []
};

exports.help = {
  name: "token-control"
};
