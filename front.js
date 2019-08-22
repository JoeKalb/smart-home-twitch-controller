// Highlight Page
let lightsToChange = []
let currentPage = 'lights-page'

for(let nav_item of document.getElementsByClassName('nav-group-item')){
    nav_item.addEventListener('click', () => {
        const currentActive = document.getElementsByClassName('nav-group-item active')
        const oldActivePage = document.getElementById(currentActive[0].getAttribute('value'))
        oldActivePage.style.display = "none"

        currentActive[0].className = 'nav-group-item'
        
        nav_item.className += " active"
        const newActivePage = document.getElementById(nav_item.getAttribute('value'))
        currentPage = nav_item.getAttribute('value')
        console.log(currentPage)
        newActivePage.style.display = ""

        clearAllThirdPaneDiv()
        switch(currentPage){
            case 'lights-page':{
                document.getElementById('color-select-div').style.display = ''
            }
            break;
            case 'colors-page':{
                document.getElementById('color-select-div').style.display = ''
            }
            break;
            case 'twitch-page':{
                document.getElementById('twitchCommandLightsDiv').style.display = ''
            }
            break;
            case 'sound-controls-page':{
                document.getElementById('soundsAddDiv').style.display = ''
            }
            break;
            case 'settings-page':{
                document.getElementById('twitchSettingsDiv').style.display = ''
            }
            break;
            default:
        }
    })
}

let clearAllThirdPaneDiv = () => {
    const thirdPaneDivs = document.getElementsByClassName('third-comlumn-class')
    for(let div of thirdPaneDivs){
        div.style.display = 'none';
    }
}

const testBtn = document.getElementById('testBtn')
testBtn.addEventListener('click', () =>{
    allOffThenOn()
})

const indiv_light_ul = document.getElementById('indiv-light-ul')
let createLightDivs = () => {
    lightDB.forEach(light => {
        const li = document.createElement('li')
        li.className = 'list-group-item light-li'
        li.draggable = true;

        const span = document.createElement('span')
        span.className = 'icon icon-lamp pull-left media-object light-span'
        span.style = 'color:grey;'

        const newLightDiv = document.createElement('div')
        newLightDiv.className = 'light-div media-body'

        const title = document.createElement('strong')
        title.innerText = `Name: ${light.name}`

        const p = document.createElement('p')
        p.innerText = `IP: ${light.address}`

        const editBtn = document.createElement('button')
        editBtn.className = "btn btn-default li-edit-btn pull-right";
        editBtn.title = "Edit Light Name"
        const spanBtn = document.createElement('span')
        spanBtn.className = "icon icon-pencil"
        spanBtn.style = 'color:black;'

        editBtn.addEventListener('click', () => {
            console.log(light._id)
            const input = document.createElement('input')
            input.placeholder = 'Change Light Name'
            input.className = 'light-input-editor'
            newLightDiv.appendChild(input)

            input.addEventListener('keypress', e => {
                const key = e.which || e.keyCode
                if(key === 13){
                    const val = input.value.trim()
                    if(val !== ''){
                        title.innerText = `Name: ${val}`

                        db.lights.update({_id:light._id}, { $set:{name:val}}, async(err, newDoc)=> {
                            console.log(newDoc)
                        })
                    }

                    input.remove()
                }
            })
        })

        const deleteBtn = document.createElement('button')
        deleteBtn.className = 'btn btn-negative li-delete-btn pull-right'
        deleteBtn.title = "Delete Light Group"
        const span2 = document.createElement('span')
        span2.className = "icon icon-cancel"
        span2.style = 'color:white;'

        

        // connect all elements
        editBtn.appendChild(spanBtn)
        deleteBtn.appendChild(span2)
        newLightDiv.appendChild(deleteBtn)
        newLightDiv.appendChild(editBtn)
        li.appendChild(span)
        li.appendChild(newLightDiv)
        newLightDiv.appendChild(title)
        newLightDiv.appendChild(p)
        indiv_light_ul.appendChild(li)

        const navLightSeclectDiv = document.getElementById('nav-light-selections-div')
        const newNavLabel = document.createElement('label')
        newNavLabel.style.position = 'relative'
        newNavLabel.style.paddingLeft = '2px'
        const newCheckBox = document.createElement('input')
        newCheckBox.type = 'checkbox'
        newCheckBox.value = light.address
        newCheckBox.checked = true;
        newCheckBox.className = 'lightChangeCheckBoxClass'
        newNavLabel.appendChild(newCheckBox)
        const newSpan = document.createElement('span')
        newSpan.innerText = light.name
        newSpan.style.position = 'absolute'
        newSpan.style.top = 0;
        newNavLabel.appendChild(newSpan)

        newCheckBox.addEventListener('click', () => {
            updateLightsToChange()
            console.log(lightsToChange)
        })

        navLightSeclectDiv.appendChild(newNavLabel)

        deleteBtn.addEventListener('click', () => {
            db.lights.remove({ _id:light._id}, {}, (err, numRemoved) => {
                console.log(numRemoved)
            })

            li.remove() 
            newNavLabel.remove()
        })

        lightsToChange = [...lightsToChange, light.address]
    })
}

let updateLightsToChange = () => {
    const lightChangeCheckBoxClass = document.getElementsByClassName('lightChangeCheckBoxClass')
    lightsToChange = []
    for(let box of lightChangeCheckBoxClass){
        if(box.checked === true)
            lightsToChange = [...lightsToChange, box.value]
    }
}

const group_light_div = document.getElementById('group-light-div')
let createGroupDivs = () => {
    lightGroupDB.forEach(group => {
        makeLightGroupLI(group)
    })
}

let makeLightGroupLI = (group) => {
    const li = document.createElement('li')
    li.className = 'list-group-item light-li'
    
    const span = document.createElement('span')
    span.className = 'icon icon-lamp pull-left media-object light-span'
    span.style = 'color:grey;'

    const newLightDiv = document.createElement('div')
    newLightDiv.className = 'light-div media-body'

    const title = document.createElement('strong')
    title.innerText = `Name: ${group.name}`

    const p = document.createElement('p')
    p.innerText = `IPs: ${group.addresses.map(ip => {
        const arr = ip.split('.')
        return arr[arr.length - 1]
    })}`

    const editBtn = document.createElement('button')
    editBtn.className = "btn btn-default li-edit-btn pull-right";
    editBtn.title = "Edit Light Name"
    const spanBtn = document.createElement('span')
    spanBtn.className = "icon icon-pencil"
    spanBtn.style = 'color:black;'

    editBtn.addEventListener('click', () => {
        console.log(group._id)
        const input = document.createElement('input')
        input.placeholder = 'Change Light Name'
        input.className = 'light-input-editor'
        newLightDiv.appendChild(input)

        input.addEventListener('keypress', e => {
            const key = e.which || e.keyCode
            if(key === 13){
                const val = input.value.trim()
                if(val !== ''){
                    title.innerText = `Name: ${val}`

                    db.lightGroups.update({_id:group._id}, { $set:{name:val}}, async(err, newDoc)=> {
                        console.log(newDoc)
                    })
                }

                input.remove()
            }
        })
    })

    const deleteBtn = document.createElement('button')
    deleteBtn.className = 'btn btn-negative li-delete-btn pull-right'
    deleteBtn.title = "Delete Light Group"
    const span2 = document.createElement('span')
    span2.className = "icon icon-cancel"
    span2.style = 'color:white;'

    deleteBtn.addEventListener('click', () => {
        db.lightGroups.remove({ _id:group._id}, {}, (err, numRemoved) => {
            console.log(numRemoved)
        })

        li.remove() 
    })

    // create element
    editBtn.appendChild(spanBtn)
    deleteBtn.appendChild(span2)
    newLightDiv.appendChild(deleteBtn)
    newLightDiv.appendChild(editBtn)
    li.appendChild(span)
    li.appendChild(newLightDiv)
    newLightDiv.appendChild(title)
    newLightDiv.appendChild(p)
    group_light_div.appendChild(li)

    li.addEventListener('click', () => {
        resetAllLightBorders()
        li.style.borderColor = 'rgb(122, 199, 240)'
        lightsToChange = group.addresses
    })
}

function resetAllLightBorders() {
    const lis = document.getElementsByClassName('light-li')
    for(let li of lis){
        li.style.borderColor = 'transparent'
    }
}

const refreshLightsBtn = document.getElementById('refreshLightsBtn')
refreshLightsBtn.addEventListener('click', () => {
    discovery.scan(2000).then(lights => {
        console.log(lights)
        let needsToRefresh = false;
        lights.forEach(light => {
            db.lights.find({address: light.address}, (err, docs) => {
                if(docs.length === 0){
                    needsToRefresh = true;
                    light.name = light.address
                    db.lights.insert(light)
                }
            })
        })

        if(needsToRefresh){
            removeAllChildren('indiv-light-ul')
            createLightDivs()
        }
    })
})

function removeAllChildren(html_id){
    const ul = document.getElementById(html_id)
    while(ul.firstChild)
        ul.removeChild(ul.firstChild)
}

const addGroupBtn = document.getElementById('addGroupBtn')
const addGroupDiv = document.getElementById('addGroupDiv')
let addGroupOpen = false;
addGroupBtn.addEventListener('click', () => {
    if(addGroupOpen){
        addGroupOpen = false;
        addGroupDiv.style = "display:none;"
    }
    else{
        addGroupOpen = true;
        addGroupDiv.style = "display:relative"
    

        const form_group_items = document.getElementById('form_group_items')
        const checkBoxes = form_group_items.getElementsByClassName('checkbox-lights')
        if(checkBoxes.length === 0){
            db.lights.find({}, (err, docs) => {
                docs.forEach(light => {
                    const div = document.createElement('div')
                    div.className = 'checkbox'
    
                    const label = document.createElement('label')
                    const input = document.createElement('input')
                    input.type = "checkbox"
                    input.style = "float:left;"
                    input.value = light.address
                    input.className = "checkbox-lights"
                    
                    const span = document.createElement('span')
                    span.innerText = light.name;
    
                    div.appendChild(label)
                    label.appendChild(input)
                    label.appendChild(span)
                    form_group_items.appendChild(div)
                })
            })
        }
    }
})

const submitGroupBtn = document.getElementById('submitGroupBtn')
submitGroupBtn.addEventListener('click', e => {
    e.preventDefault()

    const groupNameInput = document.getElementById('groupNameInput')
    let name = groupNameInput.value.trim() || `Light Group`;

    let addresses = []

    const checkBoxes = form_group_items.getElementsByClassName('checkbox-lights')
    for(let check of checkBoxes){
        if(check.checked)
            addresses = [...addresses, check.value]
    }

    if(addresses.length > 0){
        const newGroup = {
            name,
            addresses
        }
        
        db.lightGroups.insert(newGroup, async(err, newDoc) => {
            lightGroupDB = await [...lightGroupDB, newDoc]

            makeLightGroupLI(newDoc)
        })
    }
    addGroupOpen = false
    addGroupDiv.style = "display:none;"
})

const cancelGroupBtn = document.getElementById('cancelGroupBtn')
cancelGroupBtn.addEventListener('click', e => {
    e.preventDefault()
    const groupNameInput = document.getElementById('groupNameInput')
    groupNameInput.value = ''
    addGroupOpen = false;
    addGroupDiv.style = "display:none;"
})

const addColorDiv = document.getElementById('addColorDiv')
const addColorBtn = document.getElementById('addColorBtn')
let addColorDivOpen = false;
let editID = ''
addColorBtn.addEventListener('click', () => {
    if(addColorDivOpen){
        addColorDivOpen = false;
        addColorDiv.style ='display:none;'
        editID = ''
    }
    else{
        editID = ''
        addColorDivOpen = true;
        addColorDiv.style = 'display:relative;'

        const singleColorStrong = document.getElementById('singleColorStrong')
        singleColorStrong.innerText = 'Add New Color'

        const colorNameInput = document.getElementById('colorNameInput')
        colorNameInput.value = ''

        const addColorDisplayBox = document.getElementById('addColorDisplayBox')
        addColorDisplayBox.style.backgroundColor = colorPicker.color.rgbString
    }
})

const submitColorBtn = document.getElementById('submitColorBtn')
submitColorBtn.addEventListener('click', e=> {
    e.preventDefault();
    const colorNameInput = document.getElementById('colorNameInput')
    const val = colorNameInput.value.trim()

    if(editID === ''){
        submitColorAction(val, colorPicker.color.rgb)
    }else{
        submitColorAction(val, colorPicker.color.rgb, editID)
    }
    
    colorNameInput.value = ''
    addColorDivOpen = false
    addColorDiv.style ='display:none;'
    editID = ''
})

const cancelColorBtn = document.getElementById('cancelColorBtn')
cancelColorBtn.addEventListener('click', e => {
    e.preventDefault()

    addColorDivOpen = false
    addColorDiv.style ='display:none;'
    editID = ''

    submitColorBtn.removeEventListener('click', () => {
        console.log('submit listener removed')
    })
    cancelColorBtn.removeEventListener('click', () => {
        console.log('submit listener removed')
    })
})

let submitColorAction = (name, rgb, id=false) => {
    if(id){
        const updatedDoc = {
            name,
            rgb
        }
        db.colors.update({ _id:id }, updatedDoc, (err, numReplaced) => {
            if(numReplaced === 1){
                const updateTableName = document.getElementById(`td Name Color ID: ${id}`)
                updateTableName.innerText = name;

                const updateTDColorDiv = document.getElementById(`tdColorDiv ID: ${id}`)
                updateTDColorDiv.style.backgroundColor = colorPicker.color.rgbString

                const updateOption = document.getElementById(`Color Option: ${id}`)
                updateOption.value = name
            }
        })
    }
    else{
        console.log(`add new color ${name}`, rgb)
        const doc = {
            name,
            rgb
        }
        db.colors.insert(doc, (err, newDoc) => {
            makeNewColorRow(newDoc)

            const colorsList = document.getElementById('colorsList')
            const newOption = document.createElement('option')
            newOption.value = newDoc.name
            newOption.id = `Color Option: ${newDoc._id}`
            colorsList.appendChild(newOption)
        })
    }
}

let makeNewColorRow = (colorDoc) => {
    const newTableRow = document.createElement('tr')

    const tdName = document.createElement('td')
    tdName.innerText = colorDoc.name;
    tdName.style.width = '20%'
    tdName.id = `td Name Color ID: ${colorDoc._id}`

    const tdColor = document.createElement('td')
    const tdColorDiv = document.createElement('div')
    tdColorDiv.className = 'tdColorDiv'
    const { r,g,b } = colorDoc.rgb
    tdColorDiv.style.backgroundColor = `rgb(${r}, ${g}, ${b})`
    tdColorDiv.id = `tdColorDiv ID: ${colorDoc._id}`
    tdColor.appendChild(tdColorDiv)

    const tdButtons = document.createElement('td')
    const editBtn = document.createElement('button')
    editBtn.className = 'btn btn-mini btn-default pull-left editColorBtn'
    editBtn.title = `Edit Color ${colorDoc.name}`
    const editBtnSpan = document.createElement('span')
    editBtnSpan.className = 'icon icon-pencil'
    editBtn.appendChild(editBtnSpan)

    editBtn.addEventListener('click', () => {
        editID = colorDoc._id
        addColorDivOpen = true;
        addColorDiv.style = 'display:relative;'
        colorPicker.color.rgbString = tdColorDiv.style.backgroundColor;

        const singleColorStrong = document.getElementById('singleColorStrong')
        singleColorStrong.innerText = `Edit Color: ${tdName.innerText}`

        const addColorDisplayBox = document.getElementById('addColorDisplayBox')
        addColorDisplayBox.style.backgroundColor = colorPicker.color.rgbString

        const colorNameInput = document.getElementById('colorNameInput')
        colorNameInput.value = tdName.innerText

        const colorsList = document.getElementById('colorsList')
        colorsList.value = tdName.innerText
    })
 
    const deleteBtn = document.createElement('button')
    deleteBtn.className = 'btn btn-mini btn-negative pull-left'
    deleteBtn.innerText = 'X'
    deleteBtn.title = `Delete Color ${colorDoc.name}`

    deleteBtn.addEventListener('click', () => { 
        db.colors.remove({ _id:colorDoc._id}, (err, numRemoved) => {
            if(numRemoved === 1){
                newTableRow.remove()
                const optionToDelete = document.getElementById(`Color Option: ${newDoc._id}`)
                optionToDelete.remove()
            }
        })
    })

    tdButtons.appendChild(editBtn)
    tdButtons.appendChild(deleteBtn)

    const colorTableBody = document.getElementById('colorTableBody')
    newTableRow.value = `Tabel Row: ${colorDoc._id}` 
    
    newTableRow.appendChild(tdName)
    newTableRow.appendChild(tdColor)
    newTableRow.appendChild(tdButtons)
    colorTableBody.appendChild(newTableRow)
}

db.colors.find({}, (err, colors) => {
    const colorsList = document.getElementById('colorsList')
    colors.forEach(color => {
        const newOption = document.createElement('option')
        newOption.value = color.name
        newOption.id = `Color Option: ${color._id}`
        colorsList.appendChild(newOption)

        makeNewColorRow(color)
    })
})

const addPatternBtn = document.getElementById('addPatternBtn')
addPatternBtn.addEventListener('click', () => {
    const addPatternFormDiv = document.getElementById('addPatternFormDiv')
    if(addPatternFormDiv.style.display === 'none'){
        addPatternFormDiv.style = 'display:relative'

        const colorPatternDiv = document.getElementById('colorPatternDiv')
        colorPatternDiv.style.backgroundColor = colorPicker.rgbString
    }
    else{
        addPatternFormDiv.style = 'display:none'
    }
})

const colorPatternDiv = document.getElementById('colorPatternDiv')
colorPatternDiv.addEventListener('click', () => {
    if(isMaxColorPatterns()){
        const colorContainer = document.getElementById('pattern-color-select-div')
        const newColorDiv = document.createElement('div')
        newColorDiv.style.backgroundColor = colorPicker.color.rgbString
        newColorDiv.className = 'patterColorDivClass'
        newColorDiv.title = 'Delete Color'
        newColorDiv.addEventListener('click', () => {
            newColorDiv.remove()
        })
    
        const span = document.createElement('span')
        span.className = 'icon icon-cancel-squared deleteColorPatternClass'
    
        newColorDiv.appendChild(span)
        colorContainer.insertBefore(newColorDiv, colorPatternDiv)
    }
})

let isMaxColorPatterns = () => {
    const currentPatterns = document.getElementsByClassName('patterColorDivClass')
    return currentPatterns.length < 16;
}

db.patters.find({}, (err, patterns) => {
    patterns.forEach(pattern => {
        createPatterli(pattern)
    })
})

const customPattersUL = document.getElementById('custom-patters-ul')
let createPatterli = (pattern) => {
    const li = document.createElement('li')
    li.className = 'patter-li'

    const nameDiv = document.createElement('div')
    nameDiv.className = 'nameDivPatterLi'
    const strong = document.createElement('strong')
    strong.innerText = pattern.name
    strong.className = 'strongPatternLI'
    const strong2 = document.createElement('strong')
    strong2.innerText = `Delay: ${pattern.delay}`
    strong2.className = 'strongPatternLI'

    const lightPatterDivLI = document.createElement('div')
    lightPatterDivLI.className = 'pattern-div-container'
    pattern.colors.forEach(color => {
        const { r,g,b } = color
        const newColorDiv = document.createElement('div')
        newColorDiv.style.backgroundColor = `rgb(${r},${g},${b})`
        newColorDiv.className = 'indiv-patter-color-div'
        lightPatterDivLI.appendChild(newColorDiv)
    })

    const previewBtn = document.createElement('button')
    previewBtn.className = "btn btn-default pattern-preview-btn"
    previewBtn.innerText = 'PREVIEW'
    previewBtn.addEventListener('click', () => {
        playLightPattern(lightsToChange, pattern.colors, pattern.delay)
    })

    const deleteBtn = document.createElement('button')
    deleteBtn.className = "btn btn-negative pattern-delete-btn"
    deleteBtn.innerText = 'X'
    deleteBtn.addEventListener('click', () => {
        console.log(`Delete: ${pattern._id}`)
        db.patterns.remove({ _id:pattern._id}, (err, numRemoved) => {
            if(numRemoved === 1){
                li.remove()
            }
        })
    })

    nameDiv.appendChild(strong)
    nameDiv.appendChild(strong2)
    li.appendChild(nameDiv)
    li.appendChild(lightPatterDivLI)
    li.appendChild(previewBtn)
    li.appendChild(deleteBtn)
    customPattersUL.appendChild(li)
}

const submitPatterBtn = document.getElementById('submitPatterBtn')
submitPatterBtn.addEventListener('click', e => {
    e.preventDefault()

    const patternDivs = document.getElementsByClassName('patterColorDivClass')
    if(patternDivs.length > 0){
        const patternNameInput = document.getElementById('patternNameInput')
        const name = patternNameInput.value.trim()

        const patternDelayInput = document.getElementById('patternDelayInput')
        const delay = parseInt(patternDelayInput.value)

        let colors = []
        for(let div of patternDivs){
            const rgbSingleDiv = div.style.backgroundColor.replace('rgb(', '').replace(')','').split(',')
            const newRGB = {
                r:parseInt(rgbSingleDiv[0]),
                g:parseInt(rgbSingleDiv[1]),
                b:parseInt(rgbSingleDiv[2])
            }
    
            colors = [...colors, newRGB]
        }

        const doc = {
            name,
            delay,
            colors
        }

        db.patters.insert(doc, (err, newDoc) => {
            console.log(newDoc)
            createPatterli(newDoc)
        })
    }

    patternNameInput.value = ''
    patternDelayInput.value = '1'
    while(patternDivs[0]){
        patternDivs[0].remove()
    }

    const addPatternFormDiv = document.getElementById('addPatternFormDiv')
    addPatternFormDiv.style = 'display:none'

    console.log('submit')
})

const testPatterBtn = document.getElementById('testPatterBtn')
testPatterBtn.addEventListener('click', e => {
    e.preventDefault()

    const patternDivs = document.getElementsByClassName('patterColorDivClass')

    let rgbArr = []

    for(let div of patternDivs){
        const rgbSingleDiv = div.style.backgroundColor.replace('rgb(', '').replace(')','').split(',')
        const newRGB = {
            r:parseInt(rgbSingleDiv[0]),
            g:parseInt(rgbSingleDiv[1]),
            b:parseInt(rgbSingleDiv[2])
        }

        rgbArr = [...rgbArr, newRGB]
    }

    const patternDelayInput = document.getElementById('patternDelayInput')
    const delay = parseInt(patternDelayInput.value)
    
    playLightPattern(lightsToChange, rgbArr, delay)
})

const cancelPatterBtn = document.getElementById('cancelPatterBtn')
cancelPatterBtn.addEventListener('click', e => {
    e.preventDefault()

    const patternNameInput = document.getElementById('patternNameInput')
    patternNameInput.value = ''

    const patternDelayInput = document.getElementById('patternDelayInput')
    patternDelayInput.value = '1'

    const patternDivs = document.getElementsByClassName('patterColorDivClass')
    while(patternDivs[0]){
        patternDivs[0].remove()
    }
 
    const addPatternFormDiv = document.getElementById('addPatternFormDiv')
    addPatternFormDiv.style = 'display:none'
    console.log('cancel')
})

const twitchEventTypeSelect = document.getElementById('twitchEventTypeSelect')
twitchEventTypeSelect.addEventListener('click', () => {
    const twitchAmountNumberLabel = document.getElementById('twitchAmountNumberLabel')
    switch(twitchEventTypeSelect.value){
        case'sub':{
            twitchAmountNumberLabel.innerText = 'Months'
            break;
        }
        case'gift':{
            twitchAmountNumberLabel.innerText = 'Months'
            break;
        }
        case 'mass gift':{
            twitchAmountNumberLabel.innerText = 'Number of Subs'
            break;
        }
        case 'bits':{
            twitchAmountNumberLabel.innerText = 'Amount'
            break;
        }
        case 'host':{
            twitchAmountNumberLabel.innerText = 'Viewers'
            break;
        }
        case 'raid':{
            twitchAmountNumberLabel.innerText = 'Viewers'
            break;
        }
        default:
    }
})

const twitchEventsSubmitBtn = document.getElementById('twitchEventsSubmitBtn')
twitchEventsSubmitBtn.addEventListener('click', e => {
    e.preventDefault()

    const twitchEventTypeSelect = document.getElementById('twitchEventTypeSelect')
    const twitchAmountNumberInput = document.getElementById('twitchAmountNumberInput')
    const twitchEventLightSelect = document.getElementById('twitchEventLightSelect')
    const twitchEventsColorAndPatternSelect = document.getElementById('twitchEventsColorAndPatternSelect')
})

const twitchEventsCancelBtn = document.getElementById('twitchEventsCancelBtn')
twitchEventsCancelBtn.addEventListener('click', e => {
    e.preventDefault()

    document.getElementById('twitchEventTypeSelect').value = ''
    document.getElementById('twitchAmountNumberInput').value = ''
    document.getElementById('twitchEventLightSelect').value = ''
    document.getElementById('twitchEventsColorAndPatternSelect').value = ''
})