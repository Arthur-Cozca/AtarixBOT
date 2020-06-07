const Discord = require("discord.js");
const moment = require("moment");
moment.locale('FR');

module.exports = {
    name: "gstart",
    category: "giveaway",
    description: "start un giveaway",

    run: async (bot, message, args) => {
   var item = "";
   var time;
   var winnerCount;

   if (!message.member.hasPermission("ADMINISTRATOR")) {
       return message.channel.send(":x: Vous n'avez pas les permissions !");
   };

   if(!args[0]){
     return message.reply(":x: Merci d'indiquer un nombre de gagnant !");
   }
   if(!args[1]){
     return message.reply(":x: Merci d'indiquer un temps en heures!");
   }
   if(!args[2]){
     return message.reply(":x: Merci d'indiquer le lot mis en jeu !");
   }
    if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
            return message.reply("Merci de me donner un nombre entier supérieur à 0 SVP").then(m => m.delete(5000));
       }
    if (isNaN(args[1]) || parseInt(args[0]) <= 0) {
            return message.reply("Merci de me donner un nombre entier supérieur à 0 pour le temps (en heure)").then(m => m.delete(5000));
        }



   winnerCount = args[0];

   time = args[1];
   item = args.splice(2, args.length).join(' ');

   var date = new Date().getTime();
   var dateTime = new Date(date + (time * 1000 * 60 * 60));

   var giveawayEmbed = new Discord.RichEmbed()
   .setTitle(`🎉 Giveaway de ${message.author.tag} 🎉`)
   .setFooter(`Fini le : ${moment.utc(dateTime.getTime()).add("2", "hours").format('LL à HH:mm')}`)
   .setDescription(`Nombre de gagnant : ${args[0]}\nRécompense : ${item}`)
   .setColor("PURPLE");

   var embedSend = await message.channel.send(giveawayEmbed);
   embedSend.react("🎉");

   setTimeout(function () {
       var random = 0;
       var winners = [];
       var inList = false;

       var peopleReacted = embedSend.reactions.get("🎉").users.array();

       for (var i = 0; i < peopleReacted.length; i++) {
           if (peopleReacted[i].id == client.user.id) {
               peopleReacted.splice(i, 1);
               continue;
           }
       }

       if (peopleReacted.length == 0) {
           return message.channel.send("Il n'y a pas assez de participant");
       }

       if (peopleReacted.length < winnerCount) {
           return message.channel.send("Il n'y a pas assez de participant");
       }

       for (var i = 0; i < winnerCount; i++) {
           inList = false;

           random = Math.floor(Math.random() * peopleReacted.length);
           for (var y = 0; y < winners.length; y++) {
               if (winners[y] == peopleReacted[random]) {
                   i--;
                   inList = true;
                   break;
               }
           }

           if (!inList) {
               winners.push(peopleReacted[random]);
           }
       }


       for (var i = 0; i < winners.length; i++) {
           message.channel.send("Félicitations à " + winners[i] + `! Tu viens de gagner **${item}**.`);
       }

   }, 60 *  1000 * time);
    }
}
