const { session } = require("passport")

window.onload = function () {
    const button = document.querySelector('button')
    button.onclick = submit
    setListener()
}

const submit = function (e) {
    e.preventDefault()

    debugger

    let form = document.querySelector('form')
    form.reset()
    return false
}

function setListener() { //doesnt get called immdiately right now
    document.getElementById('in').addEventListener("change", event => {
        if (event.target.value.length > 8) {
            event.target.value = event.target.value.substring(0, 8)
        }
        if (event.target.value.length === 2 && !event.target.value.includes(':')) {
            event.target.value = event.target.value.slice(0, 1) + ":" + event.target.value.slice(1)
        }
        if (event.target.value.length === 5 && !event.target.value.includes('.')) {
            event.target.value = event.target.value.slice(0, 4) + "." + event.target.value.slice(4)
        }
        console.log('here')
    })
}