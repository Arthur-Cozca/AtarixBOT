module.exports = {
    name: "ping",

    run: async (client, message, args) => {
      const loading = client.emojis.find(emoji => emoji.name === "loading");
      const msg = await message.channel.send(`${loading}`);

        msg.edit(`Ping Terminé
        Mon ping est de ${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms
        Le ping de l'api est de ${Math.round(client.ping)}ms`);
    }
}
