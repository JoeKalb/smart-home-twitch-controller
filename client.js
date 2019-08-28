const tmi = require('tmi.js')
const convertColor = require('color-convert')

const opts = {
    identity: {
        username: 'botfish5',
        password: 'oauth:4l1rocvdx1cdutdeu28qlis1sesg74'
      },
      channels: [
        'thabuttress'
      ]
};

let client = new tmi.client(opts)

client.on('connected', onConnectedHandler)
client.on('disconnected', onDisconnectedHandler)

client.connect()

client.on('cheer', onCheerHandler)
client.on('message', onMessageHandler)
client.on('subscription', onSubHandler)
client.on('subgift', onSubGiftHandler)
client.on('submysterygift', onSubMysteryGiftHandler)
client.on('resub', onResubHandler)

function onCheerHandler(channel, userstate, message){
    db.twitchEvents.find({ event: 'bits'}).sort( { amount: 1 } ).exec((err, docs) => {
        console.log(docs)
        let alertNotSent = true
        let i = 0
        const length = docs.length
        while(alertNotSent){
            const doc = docs[i]
            if(doc.amount <= userstate.bits){
                alertNotSent = false
                console.log(`Cheer Event: ${doc}`)
                playNewEvent(doc)
            }
            ++i
            if(i === length)
                alertNotSent = false
        }
    })
}

function onMessageHandler(channel, userstate, message, self){
    let parse = message.split(' ')
    if(parse[0] === '!lights' && userstate.mod){
        const rgbArr = convertColor.keyword.rgb(parse[1])

        if(rgbArr.length > 0)
            setAllColorWithArr(lightsToChange, rgbArr[0], rgbArr[1], rgbArr[2])
    }
}

function onSubHandler(channel, username, method, message, userstate){
    db.twitchEvents.find({ event:'sub', amount:0 }, (err, docs) => {
        if(docs.length > 0){
            console.log(`New Sub Event: ${docs[0]}`)
            playNewEvent(docs[0])
        }
    })
}

function onSubGiftHandler(channel, username, streakMonths, recipient, methods, userstate){
    console.log('single gift sub')
    console.log(userstate)
    /* db.twitchEvents.find({ event: 'mass gift'}).sort( { amount: 1 } ).exec((err, docs) => {
        console.log(docs)
        let alertNotSent = true
        let i = 0
        const length = docs.length
        while(alertNotSent){
            const doc = docs[i]
            if(doc.amount <= streakMonths){
                alertNotSent = false
                playNewEvent(doc)
            }
            ++i
            if(i === length)
                alertNotSent = false
        }
    }) */
}

function onSubMysteryGiftHandler(channel, username, numbOfSubs, methods, userstate){
    db.twitchEvents.find({ event: 'mass gift'}).sort( { amount: 1 } ).exec((err, docs) => {
        let alertNotSent = true
        let i = 0
        const length = docs.length
        while(alertNotSent){
            const doc = docs[i]
            if(doc.amount <= numbOfSubs){
                alertNotSent = false
                console.log(`Mystery Gift Sub Event: ${doc}`)
                playNewEvent(doc)
            }
            ++i
            if(i === length)
                alertNotSent = false
        }
    })
}

function onResubHandler(channel, username, months, message, userstate, methods){
    db.twitchEvents.find({ event: 'sub'}).sort( { amount: 1 }).exec((err, docs) => {
        let alertNotSent = true
        let i = 0
        const length = docs.length
        while(alertNotSent){
            const doc = docs[i]
            if(doc.amount <= months){
                alertNotSent = false
                console.log(`Resub Event: ${doc}`)
                playNewEvent(doc)
            }
            ++i
            if(i === length)
                alertNotSent = false
        }
    })
}

let playNewEvent = (event) => {
    if(event.type === 'Color'){
        db.colors.findOne({ _id:event.type_id }, (err, color) => {
            if(color)
                playSingleColor(lightsToChange, color.rgb, delay)
        })
    }
    else if(event.type === 'Pattern'){
        db.patterns.findOne({ _id:event.type_id }, (err, pattern) => {
            if(pattern)
                playLightPattern(lightsToChange, pattern.colors, pattern.delay)
        })
    } 
}

function onConnectedHandler(addr, port){
    console.log(`Connected to ${addr}:${port}`)
}

function onDisconnectedHandler(reason){
    console.log(`Disconnected: ${reason}`)
    process.exit(1)
}