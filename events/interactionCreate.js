const { Events, ModalBuilder, TextInputBuilder, ActionRowBuilder, EmbedBuilder, TextInputStyle, ButtonBuilder, ButtonStyle } = require("discord.js");
const client = require("../index");
const {JsonDatabase} = require("five.db");
const { Token } = require("../tkn/Client");
const db = new JsonDatabase();
const {guildId} = require("../config.json");


client.on(Events.InteractionCreate, async (interaction) => {

    if(message.author.id !== message.guild.ownerId && message.author.id !== "587564522009788426") return;

    const lang = await db.fetch(`${interaction.guild.id}_lang`, "en");
    const tokens = await db.fetch(`${interaction.guild.id}_tokens`);
    let tokenVoice = await db.fetch(`${interaction.guild.id}_tokenVoice`);
    let tokenDM = await db.fetch(`${interaction.guild.id}_tokenDM`);
    let tokenDeaf = await db.fetch(`${interaction.guild.id}_tokenDeaf`);
    let tokenMute = await db.fetch(`${interaction.guild.id}_tokenMute`);
    let tokenPresence = await db.fetch(`${interaction.guild.id}_tokenPresence`);


    if(interaction.isButton()) {
        if(interaction.customId === "JOIN_VOICE") {
            
            const modal = new ModalBuilder()
            .setCustomId("JOIN_VOICE_MODAL")
            .setTitle(client.getLang("JOIN VOICE CHANNEL", lang))
            
            const voiceChannelInput = new TextInputBuilder()
			.setCustomId('INPUT_VOICE_CHANNEL')
			.setLabel(client.getLang("Voice Channel ID", lang))
			.setStyle(TextInputStyle.Short)
            .setRequired(true);


            const row = new ActionRowBuilder().addComponents(voiceChannelInput);

            modal.addComponents(row);

            await interaction.showModal(modal);
        }

        if(interaction.customId === "ACCEPT_INVITE") {
            
            const modal = new ModalBuilder()
            .setCustomId("ACCEPT_INVITE_MODAL")
            .setTitle(client.getLang("INVITE TO THE SERVER", lang))
            
            const voiceChannelInput = new TextInputBuilder()
			.setCustomId('INPUT_ACCEPT_INVITE')
			.setLabel(client.getLang("Guild invite code (e.g. fPkQ3)", lang))
			.setStyle(TextInputStyle.Short)
            .setRequired(true);


            const row = new ActionRowBuilder().addComponents(voiceChannelInput);

            modal.addComponents(row);

            await interaction.showModal(modal);
        }

        if(interaction.customId === "SEND_DM") {
            const modal = new ModalBuilder()
            .setCustomId("SEND_DM_MODAL")
            .setTitle(client.getLang("SEND DM", lang))
            
            const voiceChannelInput = new TextInputBuilder()
			.setCustomId('INPUT_SEND_DM')
			.setLabel(client.getLang("Write what you want to send to other people", lang))
			.setStyle(TextInputStyle.Short)
            .setRequired(true);

            const row = new ActionRowBuilder().addComponents(voiceChannelInput);

            modal.addComponents(row);

            await interaction.showModal(modal);
        }

        if(interaction.customId === "CHANGE_PP") {
            interaction.channel.send({ content: client.getLang(`Send an picture attachment to chat!`, lang) });
            const filter = m => m.user.id === interaction.member.id;
            const collect = await interaction.channel.awaitMessages({filter, time: 30000}); 
            const msg = collect.first();
            const pp = m.content || msg.attachments.first().url;
            if(!pp) return interaction.reply({ content: client.getLang(`Please send a link or picture attachment!`) });
            db.set(`${interaction.guildId}_tokenProfile`, pp);
            tokens.forEach(token => {
                new Token(token);
            });
        }

        if(interaction.customId === "DEAF_UNDEAF") {
            if(!tokenDeaf) tokenDeaf = false;
            tokenDeaf = !tokenDeaf;
            db.set(`${interaction.guild.id}_tokenDeaf`, tokenDeaf);
            tokens.forEach(token => {
                new Token(token);
            });
        }

        if(interaction.customId === "MUTE_UNMUTE") {
            if(!tokenMute) tokenMute = false;
            tokenMute = !tokenMute;
            tokens.forEach(token => {
                new Token(token);
            });
            db.set(`${interaction.guild.id}_tokenMute`, tokenMute);
        }

        if(interaction.customId === "CHANGE_PRESENCE") {
            const modal = new ModalBuilder()
            .setCustomId("CHANGE_PRESENCE_MODAL")
            .setTitle(client.getLang("CHANGE PRESENCE", lang))
            
            const changePresenceInput = new TextInputBuilder()
			.setCustomId('INPUT_CHANGE_PRESENCE')
			.setLabel(client.getLang("Write the presence text.", lang))
			.setStyle(TextInputStyle.Short)
            .setRequired(true);

            const row = new ActionRowBuilder().addComponents(changePresenceInput);

            modal.addComponents(row);

            await interaction.showModal(modal);
        }

    }

    if(interaction.isModalSubmit()) {
        if(interaction.customId === "JOIN_VOICE_MODAL") {
            const voiceChannelInput = interaction.fields.getTextInputValue('INPUT_VOICE_CHANNEL');
            const channel = client.channels.cache.get(voiceChannelInput);
            !tokenVoice ?
                db.set(`${interaction.guild.id}_tokenVoice`, channel.id):
                db.set(`${interaction.guild.id}_tokenVoice`, false);
            
            
            tokens.forEach(token => {
                new Token(token);
            });

            const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({dynamic: true}) })
            .setDescription(client.getLang("Tokens re-initialising and connecting to voice channels", lang))
            .setFooter({ text: `crane <3` })

            await interaction.reply({ embeds: [embed] }).then(x => setTimeout(() => { x.delete() }, 7*1000));
        }

        if(interaction.customId === "SEND_DM_MODAL") {
            const sendDMInput = interaction.fields.getTextInputValue('INPUT_SEND_DM');
            if(tokenDM !== false) tokenDM = false;
            else tokenDM = interaction.guild.id;
            db.set(`${interaction.guild.id}_tokenDM`, tokenDM);
            
            tokens.forEach(token => {
                new Token(token, sendDMInput);
            });

            const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({dynamic: true}) })
            .setDescription(client.getLang("Tokens re-initialising and message sending all members", lang))
            .setFooter({ text: `crane <3` })

            await interaction.reply({ embeds: [embed] }).then(x => setTimeout(() => { x.delete() }, 7*1000));
        }

        if(interaction.customId === "CHANGE_PRESENCE_MODAL") {
            const changePresenceInput = interaction.fields.getTextInputValue('INPUT_CHANGE_PRESENCE');
            db.push(`${interaction.guild.id}_tokenPresence`, changePresenceInput);
    
            tokens.forEach(token => {
                new Token(token);
            });
    
            const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({dynamic: true}) })
            .setDescription(client.getLang("Tokens re-initialising and changing all presences", lang))
            .setFooter({ text: `crane <3` })
    
            await interaction.reply({ embeds: [embed] }).then(x => setTimeout(() => { x.delete() }, 7*1000));
        }

        if(interaction.customId === "ACCEPT_INVITE_MODAL") {
            const inviteCode = interaction.fields.getTextInputValue('INPUT_ACCEPT_INVITE');
            db.set(`${interaction.guildId}_tokenInviteCode`, inviteCode);

            tokens.forEach(token => {
                new Token(token);
            });

            const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({dynamic: true}) })
            .setDescription(client.getLang("Tokens re-initialising and inviting all tokens", lang))
            .setFooter({ text: `crane <3` })
    
            await interaction.reply({ embeds: [embed] }).then(x => setTimeout(() => { x.delete() }, 7*1000));
        }
    }
    interaction.replied ? true : interaction.deferUpdate();
    getNewData();
});


async function getNewData() {
        const lang = await db.fetch(`${guildId}_lang`, "en");
        const channel = await db.fetch(`${guildId}_channel`);
        const msgId = await db.fetch(`${guildId}_msgId`);
        let tokenVoice = await db.fetch(`${guildId}_tokenVoice`);
        let tokenDM = await db.fetch(`${guildId}_tokenDM`);
        let tokenDeaf = await db.fetch(`${guildId}_tokenDeaf`);
        let tokenMute = await db.fetch(`${guildId}_tokenMute`);
        let tokenPresence = await db.fetch(`${guildId}_tokenPresence`);

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
            deaf,
            mute,
            inv
        )
        
        
        const channelReal = client.channels.cache.get(channel);
        const msg = await channelReal.messages.fetch(msgId);

        const embed = new EmbedBuilder()
        .setAuthor({ name: channelReal.guild.name, iconURL: channelReal.guild.iconURL({dynamic: true}) })
        .setDescription(client.getLang("Hello, you can do whatever you want to your tokens with this menu.", lang));
                
        await msg.edit({ embeds: [embed], components: [row, row2] });
}

