const tmi = require('tmi.js')

const opts = {
    identity: {
        username: 'botfish5',
        password: 'oauth:4l1rocvdx1cdutdeu28qlis1sesg74'
      },
      channels: [
        'thabuttress',
        'mopgarden'
      ]
};

let client = new tmi.client(opts)

client.on('connected', onConnectedHandler)
client.on('disconnected', onDisconnectedHandler)

client.connect()

//client.on('cheer', onCheerHandler)
//client.on('message', onMessageHandler)
//client.on('subscription', onSubHandler)
client.on('subgift', onSubGiftHandler)
client.on('submysterygift', onSubMysteryGiftHandler)
//client.on('resub', onResubHandler)

function onCheerHandler(channel, userstate, message){
    console.log(channel)
    console.log(userstate)
    console.log(message)
    doAllLightEffects()
}

function onMessageHandler(channel, userstate, message, self){
    console.log(message)
}

function onSubHandler(channel, username, method, message, userstate){
    console.log(channel)
    console.log(username)
    console.log(method)
    console.log(message)
    console.log(userstate)
    const info = {
        type:'sub'
    }
    doAllLightEffects(info)
}

function onSubGiftHandler(channel, username, streakMonths, recipient, methods, userstate){
    //console.log(channel)
    //console.log(username)
    //console.log(streakMonths)
    //console.log(recipient)
    //console.log(methods)
    console.log(userstate)
    const info = {
        type:'giftsub'
    }
    //doAllLightEffects(info)
}

function onSubMysteryGiftHandler(channel, username, numbOfSubs, methods, userstate){
    //console.log(channel)
    //console.log(username)
    console.log(numbOfSubs)
    //console.log(methods)
    console.log(userstate)
    const info = {
        type:'mysterygift',
        count:numbOfSubs
    }
    //doAllLightEffects(info)
}

function onResubHandler(channel, username, months, message, userstate, methods){
    console.log(channel)
    console.log(username)
    console.log(months)
    console.log(message)
    console.log(userstate)
    console.log(methods)
    const info = {
        type:'resub',
        months
    }
    //doAllLightEffects(info)
}

function onConnectedHandler(addr, port){
    console.log(`Connected to ${addr}:${port}`)
}

function onDisconnectedHandler(reason){
    console.log(`Disconnected: ${reason}`)
    process.exit(1)
}