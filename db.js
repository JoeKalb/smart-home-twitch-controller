const Datastore = require('nedb')
const path = require('path')

const filePath = {
    dbPathLights:path.join('./database/lights.db'),
    dbPathLightGroups:path.join('./database/lightGroups.db'),
    dbPathColors:path.join('./database/colors.db'),
    dbPathPatterns:path.join('./database/patters.db'),
    dbPathTwitch:path.join('./database/twitch.db'),
    dbPathTwitchCommands:path.join('./database/twitchCommands.db')
}

const db = {}

db.lights = new Datastore({
    filename:filePath.dbPathLights,
    autoload:true,
    onload: err => {
        if(err){
            console.log(`Error while loading the db: ${err}`)
        }
        db.lights.find({}, (err, docs) => {
            return docs
        })
    }
})

db.lightGroups = new Datastore({
    filename:filePath.dbPathLightGroups,
    autoload:true,
    onload: err => {
        if(err){
            console.log(`Error while loading the db: ${err}`)
        }
        db.lightGroups.find({}, (err, docs) => {
            return docs
        })
    }
})

db.colors = new Datastore({
    filename:filePath.dbPathColors,
    autoload:true,
    onload: err => {
        if(err){
            console.log(`Error while loading the db: ${err}`)
        }
        db.lightGroups.find({}, (err, docs) => {
            return docs
        })
    }
})
 
db.patters = new Datastore({
    filename:filePath.dbPathPatterns,
    autoload:true,
    onload: err => {
        if(err){
            console.log(`Error while loading the db: ${err}`)
        }
        db.patters.find({}, (err, docs) => {
            return docs
        })
    }
})

db.twitch = new Datastore({
    filename:filePath.dbPathTwitch,
    autoload:true,
    onload: err => {
        if(err){
            console.log(`Error while loading the db: ${err}`)
        }
        db.twitch.find({}, (err, docs) => {
            return docs
        })
    }
})

db.twitchCommands = new Datastore({
    filename:filePath.dbPathTwitchCommands,
    autoload:true,
    onload: err => {
        if(err){
            console.log(`Error while loading the db: ${err}`)
        }
        db.twitch.find({}, (err, docs) => {
            return docs
        })
    }
})

module.exports = db;