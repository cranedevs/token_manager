const client = require("../index");
const {JsonDatabase} = require("five.db");
const { Token } = require("../tkn/Client");
const db = new JsonDatabase();
const {bgRed} = require("colors");
const {guildId} = require("../config.json");

client.on("ready", async () => {
    console.log(`${client.user.tag} İsmi İle Bot Aktif!`)
    client.user.setActivity(`Krema`)

    const tokens = await db.fetch(`${guildId}_tokens`);
    const activeTokens = 0;

    if(!token) return;
    for(token of tokens) {
        try {
            new Token(token);
        } catch (e) {}
    }
});
