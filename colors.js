const colorPicker = new iro.ColorPicker('#color-picker-container', {})

const rgbInputs = document.getElementsByClassName('num-input')
const r_input = document.getElementById('r-input')
const g_input = document.getElementById('g-input')
const b_input = document.getElementById('b-input')
const color_display_div = document.getElementById('color-display-box')

colorPicker.on('color:init', (color) => {
    const { r, g, b } = color.rgb;
    r_input.value = r;
    g_input.value = g;
    b_input.value = b;

    color_display_div.style.backgroundColor = colorPicker.color.rgbString

})


colorPicker.on('color:change', (color, changes) => {
    const { r, g, b } = color.rgb;
    r_input.value = r;
    g_input.value = g;
    b_input.value = b;

    color_display_div.style.backgroundColor = colorPicker.color.rgbString
    colorsListInput.value = ''

    if(addColorDivOpen){
        const addColorDisplayBox = document.getElementById('addColorDisplayBox')
        addColorDisplayBox.style.backgroundColor = colorPicker.color.rgbString
    }

    const addPatternFormDiv = document.getElementById('addPatternBtn')
    if(addPatternFormDiv.style.display !== 'none'){
        const colorPatternDiv = document.getElementById('colorPatternDiv')
        colorPatternDiv.style.backgroundColor = colorPicker.color.rgbString
    }
})

for(let input of rgbInputs){
    input.addEventListener('input', () => {
        const { r, g, b} = getCurrentRGB()

        if(allInRange(r, g, b)){
            colorPicker.color.rgb = {r,g,b}
            color_display_div.style.backgroundColor = colorPicker.color.rgbString
        }
    })

    input.addEventListener('keypress', e => {
        const key = e.which || e.keyCode;
        if(key === 13){
            const {r,g,b} = getCurrentRGB()
            if(allInRange(r, g, b))
                setAllColors(r, g, b)
        }
    })
}

let allInRange = (r, g, b) => {
    return r >=0 && r <=255
        && g >=0 && g <= 255
        && b >=0 && b <= 255
}

let getCurrentRGB = () => {
    return {
        r:parseInt(r_input.value),
        g:parseInt(g_input.value),
        b:parseInt(b_input.value)
    }
}

const colorsListInput = document.getElementById('colorsListInput')
colorsListInput.addEventListener('change', () => {
    const val = colorsListInput.value.trim()
    db.colors.findOne({ name: { $regex: new RegExp(val, 'i')}}, (err, doc) => {
        if(doc){
            colorPicker.color.rgb = doc.rgb
            colorsListInput.value = doc.name
        }
    })
 })

const colorSetBtn = document.getElementById('color-btn')
colorSetBtn.addEventListener('click', () => {
    const { r, g, b } = getCurrentRGB()

    switch(currentPage){
        case 'lights-page':{
            setAllColorWithArr(lightsToChange, r, g, b)
        }
        case 'lights-customization-page':{
            if(addColorDivOpen){
                const colorNameInput = document.getElementById('colorNameInput')
                const val = colorNameInput.value.trim()

                (editID === '') ?
                    submitColorAction(val, colorPicker.color.rgb):
                    submitColorAction(val, colorPicker.color.rgb, editID)
                console.log(r, g, b)
            }
        }
    }
})
