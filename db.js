const Datastore = require('nedb')
const path = require('path')

const filePath = {
    dbPathLights:path.join('./database/lights.db'),
    dbPathColors:path.join('./database/colors.db'),
    dbPathPatterns:path.join('./database/patterns.db'),
    dbPathTwitchEvents:path.join('./database/twitchEvents.db'),
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

db.colors = new Datastore({
    filename:filePath.dbPathColors,
    autoload:true,
    onload: err => {
        if(err){
            console.log(`Error while loading the db: ${err}`)
        }
        db.colors.find({}, (err, docs) => {
            return docs
        })
    }
})
 
db.patterns = new Datastore({
    filename:filePath.dbPathPatterns,
    autoload:true,
    onload: err => {
        if(err){
            console.log(`Error while loading the db: ${err}`)
        }
        db.patterns.find({}, (err, docs) => {
            return docs
        })
    }
}) 

db.twitchEvents = new Datastore({
    filename:filePath.dbPathTwitchEvents,
    autoload:true,
    onload: err => {
        if(err){
            console.log(`Error while loading the db: ${err}`)
        }
        db.twitchEvents.find({}, (err, docs) => {
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
        db.twitchCommands.find({}, (err, docs) => {
            return docs
        })
    }
})

module.exports = db;