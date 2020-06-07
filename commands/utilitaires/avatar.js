const {RichEmbed} = require('discord.js');

module.exports = {
    name: "avatar",
    run: (client, message, args) => {
      if(args[0] == "help"){
        message.channel.send("Usage : !avatar [Membre], permet d'afficher l avatar d un membre");
        return;
      }
      const user = message.mentions.users.first() || message.author;
      if(!user){
        message.reply("Merci de donner un utilisateur").then(m => m.delete(5000));
      }
      const avatarEmbed = new RichEmbed()
          .setColor(0x333333)
          .setAuthor(user.username)
          .setImage(user.avatarURL);
      message.channel.send(avatarEmbed);
}

}
