
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

let fila = [];

function criarPainel() {
  const embed = new EmbedBuilder()
    .setTitle("⚔️ ABSOLUTE FC | FILA 1V1")
    .setDescription(
      "Entre na fila e encontre seu adversário!\n\n" +
      "**Jogadores na fila:**\n" +
      (fila.length
        ? fila.map((id, i) => `${i + 1}. <@${id}>`).join("\n")
        : "Ninguém na fila ainda.")
    )
    .setColor("#FF0000")
    .setFooter({ text: "ABSOLUTE FC • Competitive" });

  const botoes = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("entrar_fila")
      .setLabel("ENTRAR NA FILA")
      .setEmoji("🟢")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId("sair_fila")
      .setLabel("SAIR DA FILA")
      .setEmoji("🔴")
      .setStyle(ButtonStyle.Danger)
  );

  return { embeds: [embed], components: [botoes] };
}

client.on("messageCreate", async message => {
  if (message.author.bot) return;

  if (message.content === "!fila") {
    await message.channel.send(criarPainel());
  }
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isButton()) return;

  const id = interaction.user.id;

  if (interaction.customId === "entrar_fila") {
    if (fila.includes(id)) {
      return interaction.reply({
        content: "Você já está na fila!",
        ephemeral: true
      });
    }

    fila.push(id);

    await interaction.update(criarPainel());

    if (fila.length >= 2) {
      const jogador1 = fila.shift();
      const jogador2 = fila.shift();

      await interaction.channel.send(
        `⚔️ **PARTIDA ENCONTRADA!**\n\n` +
        `🥊 <@${jogador1}> VS <@${jogador2}>\n\n` +
        `Boa sorte aos jogadores!`
      );

      await interaction.message.edit(criarPainel());
    }
  }

  if (interaction.customId === "sair_fila") {
    if (!fila.includes(id)) {
      return interaction.reply({
        content: "Você não está na fila!",
        ephemeral: true
      });
    }

    fila = fila.filter(player => player !== id);

    await interaction.update(criarPainel());
  }
});

client.once("ready", () => {
  console.log(`ABSOLUTE FC ONLINE: ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);

