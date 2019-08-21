const { Control, Discovery, CustomMode } = require('magic-home')

const db = require('./db')

let discovery = new Discovery()

let lightDB = []

let lightControllers = []

//create or get lights from database
db.lights.find({}, async(err, docs) => {
    lightDB = docs

    if(lightDB.length === 0){
        discovery.scan(5000).then(lights => {
            lights.map(light => {
                light.name = light.address
            })
            db.lights.insert(lights, async(err, newDocs) => {
                console.log(newDocs)
                lightDB = await newDocs
            })
        })
    }

    makeLightControllers(lightDB.map(i => {
        return i.address
    }))
    console.log(lightControllers)

    createLightDivs()
})

async function findLights(){
    let devices = discovery.scan(5000)

    let addresses = []
    let allInfo = []
    devices.forEach(device => {
        allInfo = [...allInfo, device]
        addresses = [...addresses, device.address]
        lightControllers = [...lightControllers, new Control(device.address)]
    })

    console.log(allInfo)
    makeLightControllers(addresses);

    if(addresses.length > 0)
        fs.writeFileSync('lights.json', JSON.stringify({addresses, allInfo}))

    return devices;
}

function makeLightControllers(arr){
    arr.forEach(address => {
        lightControllers = [...lightControllers, new Control(address)]
    })
}

async function loopLights(){
    let i = 0;

    let result = await findLights()

    while(result.length === 0 && i < 5){
        ++i;
        result = await findLights()
    }

    return result;
}

async function queryAll(){
    try{
        for(let light of lightControllers){
            light.queryState().then(query => {
                console.log(light._address)
                console.log(query)
            }).catch(err => {
                console.log(err)
            })
        }
    }
    catch(err){
        console.log(err)
    }
}

function toggleSwitch(){
    lightControllers.forEach(light => {
        light.queryState().then(query => {
            (query.on) ? 
                light.turnOff():light.turnOn()
        })
    })
}

function allOn(){
    const len = lightControllers.length
    for(let i = 0; i < len; ++i){
        lightControllers[i].setPower(true)
        //console.log(result)
    }
}

async function allOffThenOn(){
    try{
        const len = lightControllers.length
        for(let i = 0; i < len; ++i){
            lightControllers[i].turnOff().then((res) => {
                console.log(res)
            }).catch(err=> {
                console.log(`${lightControllers[i]._address} not connected :(`)
            })
            lightControllers[i].turnOn().then((res) => {
                console.log(res)
            }).catch(err=> {
                console.log(`${lightControllers[i]._address} not connected :(`)
            })
            //console.log(result)
        }
    }
    catch(err){
        console.log(err)
    }
}

async function setAllColor(r, g, b){
    try{
        const len = lightControllers.length
        for(let i = 0; i < len; ++i){
            lightControllers[i].setColor(r, g, b)
            //console.log(result)
        }
    }
    catch(err){
        console.log(err)
    }
}

async function setColorsWithBrightness(r, g, b, level){
    for(let light of lightControllers){
        try{
            light.setColorWithBrightness(r, g, b, level)

            /* let query = await light.queryState()
            const { color } = query
            console.log(color)
            if(color.red != r || color.green != g || color.blue != b){
                console.log('here')
                let newLight =  new Control(light._address, ack=Control.ackMask(3)) //await light.ackMask(3).setColorWithBrightness(r, g, b, level)
                console.log(newLight)
                newLight.setColorWithBrightness(r, g, b, level)
                console.log(result)
                newLight.queryState()
                console.log(query)
            } */
        }
        catch(err){
            console.log(err)
        }
    }
}

async function setPatternAll(pattern, speed){
    try{
        const len = lightControllers.length
        for(let i = 0; i < len; ++i){
            lightControllers[i]
                .setPattern(pattern, speed)
        }
    }
    catch(err){
        console.log(err)
    }
}

async function setColorWithCustomPattern(r, g, b){
    try{
        const len = lightsToChange.length
        let custom = new CustomMode()
                .addColor(r, g, b).setTransitionType('fade')
        for(let i = 0; i < len; ++i){
            lightsToChange[i]
                .setCustomPattern(custom, 100)
        }
    }
    catch(err){
        console.log(err)
    }
}

async function setColorsAndWarmWhite(r, g, b, ww){
    try{
        const len = lightControllers.length
        for(let i = 0; i < len; ++i){
            lightControllers[i]
                .setColorAndWarmWhite(r, g, b, ww)
            console.log(result)
        }
    }
    catch(err){
        console.log(err)
    }
}

async function setWarmWhiteAll(ww){
    try{
        const len = lightControllers.length
        for(let i = 0; i < len; ++i){
            lightControllers[i]
                .setWarmWhite(ww)
            console.log(result)
        }
    }
    catch(err){
        console.log(err)
    }
}

let lastChange = lastChangeObject()
let lastColor = lastChangeObject()
let count = lastChangeObject()
function lastChangeObject(){
    let result = {}

    const len = lightControllers.length
    for(let i = 0; i < len; ++i)
        result[lightControllers[i]._address] = 0

    return result;
}

function doAllLightEffects(info){
    const len = lightControllers.length
    for(let i = 0; i < len; ++i){
        lightControllers[i].startEffectMode().then(effects => {
            effects.start(interval_function)
        }).catch(err => {
            console.log(err)
        })
    }
}

function setAllColors(r, g, b){
    const len = lightControllers.length
    for(let i = 0; i < len; ++i){
        lightControllers[i].startEffectMode().then(effects => {
            effects.start(interval_function)
        }).catch(err => {
            console.log(err)
        })
    }

    let count = lastChangeObject()
    function interval_function(){
        if(count[this._address] === 0){
            ++count[this._address];
            return this.setColor(r, g, b)
        }
        else
            return this.stop()
    }
}

function setAllColorWithArr(arr, r, g, b){
    const len = arr.length
    console.log(arr)
    for(let i = 0; i < len; ++i){
        new Control(arr[i]).startEffectMode().then(effects => {
            effects.start(interval_function)
        }).catch(err => {
            console.log(err)
        })
    }

    let count = arr.reduce((acc, cur) => ({ ...acc, [cur]: 0 }), {})
    function interval_function(){
        if(count[this._address] === 0){
            ++count[this._address];
            return this.setColor(r, g, b)
        }
        else
            return this.stop()
    }
}

function interval_function(){
    let now = (new Date()).getTime()

    if(count[this._address] === 20){
        ++count[this._address]
        return this.setColor(255, 255, 255)
    }
    else if(count[this._address] === 21){
        return this.stop()
    }

    ++count[this._address]
    if(now - lastChange[this._address] < 1000){
        return this.delay(Math.max(0, 1000 - (now - lastChange[this._address])))
    }
    else{
        lastColor[this._address] = (lastColor[this._address] + 1) % 3
        lastChange[this._address] = now;

        switch(lastColor[this._address]){
            case 0:
                return this.setColor(255, 0, 0)
            case 1:
                return this.setColor(0, 255, 0)
            case 2:
                return this.setColor(0, 0, 255)
        }
    }
}

let playLightPattern = (lights, rgbArr, delay) => {
    const totalIntervalCalls = rgbArr.length * 2 - 1;
    let count = lights.reduce((lights, cur) => ({ ...lights, [cur]: 0 }), {})

    function interval_function(){
        if(count[this._address] === totalIntervalCalls){
            return this.stop()
        }
        else if(count[this._address] % 2 === 0){
            const tempCount = count[this._address] / 2
            const { r,g,b } = rgbArr[tempCount]
            ++count[this._address]
            return this.setColor(r, g, b)
        }
        else if(count[this._address] % 2 === 1){
            ++count[this._address]
            return this.delay(delay*1000)
        }
    }

    const lightCount = lights.length
    for(let i = 0; i < lightCount; ++i){
        new Control(lights[i]).startEffectMode().then(effects => {
            effects.start(interval_function)
        }).catch(err => {
            console.log(err)
        })
    }
}

//findLights() 
//queryAll()
//allOffThenOn() 
//setAllColorWithInteral(0, 179, 0) // use for setting a single color
//doAllLightEffects('test')

//console.log(lightControllers) 
/* let testLight = new Control(lightControllers[1]._address)
testLight._options = {
    apply_mask:true,
    log_all_received:true,
    ack:Control.ackMask(3),
    wait_for_reply:true
}
console.log(testLight)
testLight.setColor(0, 179, 0)
testLight.queryState().then(res=> {console.log(res)}) */

//testLight.setColor(0, 179, 0)

/* 
Max warm white setting: 255
working Controller functions with current ack options.
    setPatters
    setPower
    turnOn
    turnOff
    setCustomPattern
    queryState
    startEffectMode

not working Controller functions
    setColor
    SetColorWithBrightness
    setWarmWhite

 */

/* setTimeout(() => {
    const len = lightControllers.length
    for (let i = 0; i < len; ++i) {
        lightControllers[i].queryState().then(query => {
            console.log(query)
        })
    }
}, 2000) */

/* const len = lightControllers.length
for (let i = 0; i < len; ++i) {
    lightControllers[i].setPattern('seven_color_cross_fade', 100).then(res => {
        console.log(res)
    })
}  */
