const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const fs = require("fs");
const config = require("./config.json");
const prefix = config.prefix;
const token = config.token;
const { Token } = require("./tkn/Client");
const {JsonDatabase} = require("five.db");
const db = global.db = new JsonDatabase();

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


const client = new Client({
  intents: Object.keys(GatewayIntentBits),
  partials: Object.keys(Partials) 
});


fs.readdir("./events/", (err, files) => {
  if (err) console.error(err);
  console.log(`Toplamda ${files.length} Event Var!`);
  files.forEach(f => {
    let props = require(`./events/${f}`);
    console.log(`${f} İsimli Event Aktif!`);
  });
});

client.commands = new Collection();
client.aliases = new Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  console.log(`Toplamda ${files.length} Komut Var!`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    console.log(`${props.help.name} İsimli Komut Aktif!`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.activeTokens = 0;

client.getLang = (word, language) =>  {
  if(!language) console.error("LANGUAGE IS NOT DEFINED")
  const jsonData = JSON.parse(fs.readFileSync(`./lang/${language}.json`, "utf-8"));
  return jsonData[word] || word;
};        
module.exports = client;

// ii senden
client.login(token);
