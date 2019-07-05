const FFplay = require('ffplay')
const request = require('request')
const PlugAPI = require('plugapi')
const ydl = require('youtube-dl')

var config = require('./config.json')

var credentials = {
  email: config.email,
  password: config.password
}

if (config.login_with_facebook) {
  credentials = {
    facebook: config.facebook
  }
}

const bot = new PlugAPI(credentials)
bot.connect(config.room)

var player = null
var currentCid = null

/*
  converts seconds to mm:ss
*/
function formatSeconds (seconds) {
  return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`
}

function playMedia (url, format) {
  ydl.exec(url, ['-f', format, '-g'], {}, (err, outp) => {
    if (err) console.log(err)
    player = new FFplay(outp[0], [ '-nodisp', '-autoexit' ])
  })
}

function onMediaChange (media) {
  if (player != null) {
    player.stop()
    player = null
  }
  console.log(`${media.author} - ${media.title} [${formatSeconds(media.duration)}] ${media.format === 1 ? 'YT' : 'soundcloud'}`)
  let mediaCid = media.cid
  if (media.format !== 1) {
    console.log(`soundcloud link detected: ${mediaCid}`)
    request({
      url: `https://api-v2.soundcloud.com/tracks/${media.cid}?client_id=${config.soundcloud_client_id}`,
      json: true
    }, (err, resp, body) => {
      if (err) console.log(err)
      mediaCid = body.permalink_url
      playMedia(mediaCid, 'mp3')
    })
  } else {
    // TODO: seek using bot.getTimeElapsed() bot.getTimeRemaining() -- returns seconds or -1 if no song playing
    playMedia(mediaCid, 'm4a')
  }
}

var noSong = false
bot.on(PlugAPI.events.ROOM_JOIN, (room) => {
  console.log(`Joined ${room}`)
  function loop () {
    let media = bot.getMedia()
    if (media == null) {
      if (!noSong) {
        console.log(`No song is currently playing in ${room}`)
        noSong = true
      }
      return
    }
    if (currentCid !== media.cid) {
      currentCid = media.cid
      noSong = false
      onMediaChange(media)
    }
  }
  loop()
  setInterval(loop, 4000)
})
