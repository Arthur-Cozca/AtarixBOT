const { Client, Collection, RichEmbed } = require('discord.js');
const { config } = require('dotenv');
const chalk = require('chalk');
const { readdir } = require("fs");
const ticketconfig = require('./ticket.json');

const fs = require('fs');

const client = new Client({
    disableEveryone: true
});

client.commands = new Collection();
client.aliases = new Collection();

client.categories = fs.readdirSync("./commands/");
var userTickets = new Map();

config({
    path: __dirname + "/.env"
});

["commands"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});




let guildID = client.guilds.get("541915982541619229");


client.on("ready", () => {
    console.log(chalk.green(`[CONNECTED] ${client.user.username} est connecte à l'API`));

    client.user.setPresence({
        status: process.env.STATUS,
        game: {
            name: process.env.STATUSNAME,
        }
    });
});
client.on('disconnected', function() {
    console.log(chalk.orange(`[DISCONNECTED] ${client.user.username} est deconnecte de l'API`));
});
client.on('warn', function(message) {
    console.log(chalk.yellow(`[WARN] `, message));
});

client.on('error', function(err) {
    console.log(chalk.red(`[ERROR] `, err));
    process.exit(1);
});

client.on("guildCreate", (guild) => {
    guild.owner.user.send(`${success} Hey, merci de m'avoir ajouté sur votre serveur pou gérer le shop d'Atarix, faites la commande \`help\` pour connaitre toute mes commandes :wink:`);
});

client.on("message", async message => {
    const prefix = process.env.PREFIX;

    if (message.author.bot) {
      if(message.embeds.length === 1 && message.embeds[0].description.startsWith('Clique')) {
            message.react("718848486354714895")
            .then(msgReaction => console.log('Un ticket ouvert'))
            .catch(err => console.log(err));
        }
        if(message.embeds.length === 1 && message.embeds[0].title === 'Atarix Commande') {
            message.react("718848515161325608")
            .then(reaction => console.log("Ticket fermé avec la réaction" + reaction.emoji.name))
            .catch(err => console.log(err));
        }
    };
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;

    let command = client.commands.get(cmd);

    if (!command) command = client.commands.get(client.aliases.get(cmd));


    if (command)
        command.run(client, message, args);



});
client.on('raw', payload => {
    if(payload.t === 'MESSAGE_REACTION_ADD') {
        if(payload.d.emoji.name === 'open')
        {
            if(payload.d.message_id === '718850518495133836') {
                let channel = client.channels.get(payload.d.channel_id)
                if(channel.messages.has(payload.d.message_id)) {
                    return;
                }
                else {
                    channel.fetchMessage(payload.d.message_id)
                    .then(msg => {
                        let reaction = msg.reactions.get('open:718848486354714895');
                        let user = client.users.get(payload.d.user_id);
                        client.emit('messageReactionAdd', reaction, user);
                    })
                    .catch(err => console.log(err));
                }
            }
        }

        else if(payload.d.emoji.name === 'close') {
            let channel = client.channels.get(payload.d.channel_id);
            if(channel.messages.has(payload.d.message_id)) {
                return;
            }
            else {
                channel.fetchMessage(payload.d.message_id)
                .then(msg => {
                    let reaction = msg.reactions.get('close:718848515161325608');
                    let user = client.users.get(payload.d.user_id);
                    client.emit('messageReactionAdd', reaction, user);
                })
            }
        }
    }
});

client.on('messageReactionAdd', (reaction, user) => {
    if(reaction.emoji.name === 'open') {
        if(userTickets.has(user.id) || reaction.message.guild.channels.some(channel => channel.name.toLowerCase() === 'ticket-' + user.username)) {
            user.send("Vous avez déjà une commande ouverte, merci de terminer celle-ci avant d'en ouvrir une autre !");
	    reaction.remove(user.id);
        }
        else {
	    reaction.remove(user.id);
            let guild = reaction.message.guild;
            guild.createChannel(`ticket-${user.username}`, {
                type: 'text',
                permissionOverwrites: [
                    {
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                        id: user.id
                    },
                    {
                        deny: 'VIEW_CHANNEL',
                        id: guild.id
                    },
                    {
                        allow: 'VIEW_CHANNEL',
                        id: '541917988744462336'
                    }
                ]
            }).then(ch => {
              	reaction.remove(user.id);
                ch.setParent("717465108032389170");
                userTickets.set(user.id, ch.id);
                user.send(ticketconfig.DMOpenTicket);
                ch.send(`<@${user.id}> voici votre ticket`);
                let embed = new RichEmbed()
                .setTitle('Atarix Commande')
                .setDescription('Merci de bien expliquer votre commande, afin que nos vendeurs puissent la préparer et vous la livrer !')
                .setColor('#40BCD8')
                ch.send(embed);
                ch.send(`<@&541917988744462336>`);
                let ticketopen = new RichEmbed()
                .setAuthor(client.user.username, client.user.displayAvatarURL)
                .setDescription("Ticket Ouvert")
                .setColor("#11ff00")
                .addField("Channel", `${ch.name}`)
                let logTicket = guild.channels.find("name", "logs-ticket");
                logTicket.send(ticketopen);
		

            }).catch(err => console.log(err));
        }
    }
    else if(reaction.emoji.name === 'close') {
        if(userTickets.has(user.id)) {
            if(reaction.message.channel.id === userTickets.get(user.id)) {
                let guild = reaction.message.guild;
                let embed = new RichEmbed()
                .setDescription("Le channel va être supprimé dans 5 secondes.")
                reaction.message.channel.send(embed);
                setTimeout(() => {
                    reaction.message.channel.delete('ticket fermé')
                    user.send(ticketconfig.DMCloseTicket)
                    .then(channel => {
                        console.log("Suppr" + channel.name);
                        let ticketclose = new RichEmbed()
                        .setAuthor(client.user.username, client.user.displayAvatarURL)
                        .setColor("#ff0000")
                        .setDescription("Ticket fermé")
                        .addField("Channel", `${reaction.message.channel.name}`)
                        let logTicket = guild.channels.find("name", "logs-ticket");
                        logTicket.send(ticketclose);
                        userTickets.delete(user.id);
                    })
                    .catch(err => console.log(err));
                }, 5000);
            }
        }

        else if(reaction.message.guild.channels.some(channel => channel.name.toLowerCase() === 'ticket-' + user.username)) {
            let embed = new RichEmbed();
            embed.setDescription("Le channel va être supprimé dans 5 secondes.");
            reaction.message.channel.send(embed);
            setTimeout(() => {
                reaction.message.guild.channels.forEach(channel => {
                    if(channel.name.toLowerCase() === 'ticket-' + user.username) {
                        channel.delete().then(ch => console.log('Channel Supprimé ' + ch.id))
                    }
                });
            }, 5000);
        }
    }
});

client.login(process.env.TOKEN);
