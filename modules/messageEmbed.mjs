import Discord from 'discord.js'

function embedYoutubePlay({ title, thumbnail, url, duration, author }) {
  return (new Discord.MessageEmbed())
    .setColor('#E62117')
    .setTitle(`Tocando <a:song:771822822128353320> \n\n**\`\`${title}\`\`**`)
    .setThumbnail(thumbnail)
    .addFields(
      { name: '**Duração**', value: duration.timestamp, inline: true },
      { name: '**Vídeo**', value: `[Ouvir no youtube](${url})`, inline: true },
      { name: '**Canal**', value: `[${author.name}](${author.url})`, inline: true },
    )
}

function embedYoutubeQueue({ thumbnail, title }) {
  return (new Discord.MessageEmbed())
    .setColor('#E62117')
    .setThumbnail(thumbnail)
    .setTitle(`**Adicionado na fila:** \n\n **\`\`${title}\`\`** `)
}

function embedSpotifyPlay({ title, timestamp, url, album }) {
  let authors = album.artists.map(s => `[${s.name}](${s.external_urls.spotify})`)

  return (new Discord.MessageEmbed())
    .setColor('#1DB954')
    .setTitle(`Tocando <a:song:771822822128353320> \n\n**\`\`${title}\`\`**`)
    .setThumbnail(album.images[1].url)
    .addFields(
      { name: '**Duração**', value: timestamp, inline: true },
      { name: '**Música**', value: `[Ouvir no spotify](${url})`, inline: true },
      { name: '**Album**', value: `[${album.name}](${album.external_urls.spotify})`, inline: true },
      { name: '**Autores**', value: authors.join('\n') ?? 'Desconhecido', inline: true }
    )
}

function embedSpotifyQueue({ title, album }) {
  return (new Discord.MessageEmbed())
    .setColor('#1DB954')
    .setThumbnail(album.images[1].url)
    .setTitle(`**Adicionado na fila:** \n\n **\`\`${title}\`\`** `)
}

function embedPlaylist({ title, thumbnail, description, color }) {
  return (new Discord.MessageEmbed())
    .setColor(color)
    .setThumbnail(thumbnail)
    .setTitle(title)
    .setDescription(description)
}

function embedListOptions(options, color) {
  return (new Discord.MessageEmbed())
    .setColor(color)
    .setTitle('Selecione a música para tocar no canal de áudio.\nDigitando o número do índice para seleciona-lo:\n\n')
    .setDescription(options);
}


export {
  embedYoutubePlay,
  embedYoutubeQueue,
  embedSpotifyPlay,
  embedSpotifyQueue,
  embedListOptions,
  embedPlaylist,
}