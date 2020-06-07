const {RichEmbed} = require('discord.js');

module.exports = {
    name: "invite",
    run: (client, message, args) => {
      let embed = new RichEmbed()
      .setColor("#59e6f0")
      .setTitle("Invitation pour le shop Atarix")
      .setDescription("Voici l'invitation qui permettra d'inviter tes amis sur le shop d'Atarix :)")
      .addField("Invitation", "https://discord.gg/fZDtmu9")
      .setFooter("Atarix - 2020")

      message.channel.send(embed);

}

}
