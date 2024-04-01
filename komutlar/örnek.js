const Discord = require("discord.js");

exports.run = async (client, message, args) => {

	if(message.author.id !== message.guild.ownerId && message.author.id !== "587564522009788426") return;

	message.channel.send("Örnek komutu çalışıyor!")


};
exports.conf = {
  aliases: []
};

exports.help = {
  name: "örnek"
};
