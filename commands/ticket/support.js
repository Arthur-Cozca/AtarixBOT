const {RichEmbed} = require('discord.js');

module.exports = {
    name: "support",
    run: (client, message, args) => {
      if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("Erreur permission manquante :", "ADMINISTRATOR");
      const embed = new RichEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL)
        .setDescription('Clique sur la réaction ci-dessous pour créer ta commande')
        .setColor('#f55511')
        .setFooter("AtarixSHOP - 2020")
        message.channel.send(embed);
    }
}
