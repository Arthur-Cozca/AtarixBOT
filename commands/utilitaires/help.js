const { RichEmbed } = require('discord.js');


module.exports = {
    name: "help",
    run: (client, message, args) => {

      let embed = new RichEmbed()
      .setColor("#fc8403")
      .setTitle("Help Menu")
      .setDescription("Voici toutes les commandes disponibles")
      .addField(":scroll: UTILS", "`ping`, `help`, `avatar`, `ui`, `invite`", false)
      .setFooter("Atarix - 2020")

      message.channel.send(embed);

}

}
