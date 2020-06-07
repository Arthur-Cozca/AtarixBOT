module.exports = {
    name: "say",
    category: "utils",
    description: "say",

    run: async (client, message, args) => {

message.delete();
  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Erreur permission manquante :", "MANAGE_MESSAGES");
  let botmessage = args.join(" ");
  message.channel.send(botmessage);

}
}
