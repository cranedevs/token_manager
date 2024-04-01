const { EmbedBuilder } = require("discord.js");
const { getLang } = require("..");
const {JsonDatabase} = require("five.db");
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
  
  const choice = args[0];
  const lang = await db.fetch(`${message.guild.id}_lang`, "en");
  const embed = new EmbedBuilder()

  if(choice === client.getLang("add", lang)) {
    args = args.filter(a => a !== "" && a !== " ").splice(1);
    const list = await db.get(`${message.guild.id}_tokens`);
    if(!args) return message.channel.send({ content: client.getLang("You must specify one or more tokens!", lang) });
    args.map(tokens => {
      if(list && list.some(x => x === tokens)) console.log(`You dont add already found tokens!`.bgRed);
      db.push(`${message.guild.id}_tokens`, tokens);
    })
    const embed = new EmbedBuilder()
    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
    .setDescription(client.getLang("Tokens saved succesfully!", lang))
    .setFooter({ text: "cяané <3" })
    message.channel.send({ embeds: [embed] });
  }

  if(choice === client.getLang("list", lang)) {
    const list = await db.get(`${message.guild.id}_tokens`);
    const embed = new EmbedBuilder()
    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
    .setDescription(`### ${client.getLang("List Of Tokens", lang)} \n ${list.map(x => `${x}`).join("\n")}`)
    .setFooter({ text: "cяané <3" })
    message.channel.send({ embeds: [embed] });
  }

  if(choice === client.getLang("delete", lang)) {
    let list = await db.get(`${message.guild.id}_tokens`);
    if(!list) return message.channel.send(client.getLang("No token found", lang))
    embed
    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
    .setDescription(`### ${client.getLang("List Of Tokens", lang)} \n ${list.map((x, i) => `${i}. ${x}`).join("\n")}`)
    .setFooter({ text: "cяané <3" })
    let msg = await message.channel.send({ embeds: [embed] });
    try {
      const filter = (response) => response.author.id === message.author.id;
      const collected = await message.channel.awaitMessages({filter, max: 1, time: 60000, errors: ["time"]});
      const number = collected.first().content;
      console.log(list[number])
      if(number && parseInt(number)) {
        list = list.filter(x => !x.includes(list[number]));
        db.set(`${message.guild.id}_tokens`, list);
        collected.first().delete();
        embed
        .setDescription(`### ${client.getLang("List Of Tokens", lang)} \n ${list.map((x, i) => `${i}. ${x}`).join("\n")}`)
        .setFooter({ text: `cяané <3 (${client.getLang("UPDATED", "en")})` })
        msg.edit({ embeds: [embed] });
      }
    } catch (error) {
      console.log(error)
    }
    
    
  }

};
exports.conf = {
  aliases: []
};

exports.help = {
  name: "token"
};
