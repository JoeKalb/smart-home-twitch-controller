let lightGroupDB = []

db.lightGroups.find({}, async (err, docs) => {
    lightGroupDB = await docs
    
    if(docs.length === 0){
        db.lights.find({}, async(err, docs) => {
            const allLights = {
                ['name']:'All Lights',
                ['addresses']:docs.map(i => { return i.address })
            } 
            db.lightGroups.insert(allLights, async(err, newDocs) => {
                console.log(newDocs)
                lightGroupDB = [allLights]
                console.log(lightGroupDB)
            })
        })
    }

    createGroupDivs()
})

