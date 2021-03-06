import { spTracks } from '../../utils/search_spy.mjs'
import permissionVoiceChannel from '../../utils/permissionVoiceChannel.mjs'
import helpers from '../../utils/helpers.mjs'
import { embedListOptions } from '../../utils/messageEmbed.mjs'
import {
  collectReactionNext,
  collectReactionPrev,
  collectReactionCancel,
  collectMessageOption,
  sendConnection
} from '../../utils/play.mjs'

let songs, searchTitle, songTitle = 'Para selecionar a música digite o número que está na frente do título.'

const command = {
  name: 'yp',
  description: 'Toca músicas do spotify.',
  exemple: `\n**Como usar:**\n\`\`\`${PREFIX}yp Tupac Ghetto Gospel\n\n${PREFIX}yp spotify URL\`\`\``,
  execute(useProps) {
    let { args, embed, message: { channel, author } } = useProps[0]

    if (!permissionVoiceChannel(useProps)) return

    if (args.length == 0) return channel.send(embed.setDescription(`<@${author.id}>, digite \`${PREFIX}help ${command.name}\` para obter ajuda.`))

    useProps[0].collectionProps = { author, embed, songTitle, color: '#1DB954', listOptions: command.listOptions, emojiPlayer: { prev: '\⬅️', next: '\➡️' } }
    searchTitle = args.join(' ')

    if (helpers.isSpotifyURL(args.join(' ')))
      command.spyUrl(useProps)
    else if (!(/(https|http):\/\/(.)+/.test(args.join(' '))))
      command.spyQuery(useProps)
  },

  async listOptions(pageStart, pageEnd) {
    let option = pageStart, optionsInfo

    optionsInfo = songs
      .slice(pageStart, pageEnd)
      .map(video => `**${option += 1}** ➜ <:spotify:817569762178629693> **\`${video.title}\`** \n`)

    return optionsInfo.length !== 0 ? optionsInfo : `\`Nenhum resultado relacionado a "${searchTitle}"\` `
  },

  async spyUrl(useProps) {
    const [messageProps, useMessageProps] = useProps, { collectionProps, args, embed, message: { channel, author } } = messageProps
    let url, audioId

    url = new URL(args.join(' ')) 

    audioId = 
      (audioId = url.href.match(/track\/(.)+(?=\?si)/)) ? audioId[0].replace(/[\/]*(track)[\/]/, '') : null ??
      url.pathname.replace(/[\/]*(track)[\/]/,'')

    if (!audioId) return channel.send(embed.setDescription(`<:error:773623679459262525>  link inválido`))

    collectionProps.msg = await channel.send('<a:load:771895739672428594>')

    spTracks({
      urlId: audioId,
      success: ({ data }) => {
        collectionProps.msg.delete()
        useMessageProps(messageProps)

        if (!data || data.error) return channel.send(embed.setDescription(`**<:alert:773623678830903387> não encontrei nenhuma música**.`))

        sendConnection(useProps, helpers.formatSpTrack(data))
      },
      error: err => (console.error(err), collectionProps.msg.delete())
    })
  },

  async spyQuery(useProps) {
    const [messageProps, useMessageProps] = useProps, { collectionProps, args, embed, message: { channel, author } } = messageProps

    collectionProps.msg = await channel.send('<a:load:771895739672428594>')

    spTracks({
      query: args.join(' ').toLowerCase(),
      success: async ({ data }) => {
        if (!data || data.error) {
          collectionProps.msg.delete()
          return channel.send(embed.setDescription(`<:alert:773623678830903387> nenhum resultado relacionado a **\`${searchTitle}\`**.`))
        }

        collectionProps.songs = songs = data?.items.map(helpers.formatSpTrack) ?? []
        collectionProps.type = 'query'

        command.listOptions(0, 10).then(async d => {
          collectionProps.msg.edit({
            content: '',
            embed: embedListOptions(collectionProps.songTitle, collectionProps.color, d)
          })

          if (collectionProps.songs?.length > 10) {
            collectionProps.emjPrev = await collectionProps.msg.react('\⬅️')
            collectionProps.emjNext = await collectionProps.msg.react('\➡️')
          }
          await collectionProps.msg.react('<:cancel:832394115609264158>')
          useMessageProps(messageProps)

          collectMessageOption(useProps)
          collectReactionNext(useProps)
          collectReactionPrev(useProps)
          collectReactionCancel(useProps)
        })
      },
      error: console.error
    })
  },
}

export default command