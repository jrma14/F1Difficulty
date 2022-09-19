window.onload = function () {
    const buttons = document.querySelectorAll('button')
    buttons[0].onclick = submit
    buttons[1].onclick = clear
    initLapTimeField()
}

const clear = function (e) {
    e.preventDefault()
    fetch(`/removedifficulty/?track=${document.body.getAttribute('data-endpoint')}`)
    .then(res => {
        window.location.reload()
    })
    // let form = document.querySelector('form')
    // form.reset()
}

const submit = function (e) {
    e.preventDefault()
    let laptime = document.getElementsByClassName('lapTimeField')[0].value
    fetch(`/getdifficulty/?laptime=${laptime}&track=${document.body.getAttribute('data-endpoint')}`)
    .then(res => {
        return res.json()
    })
    .then(json => {
        console.log(json)
        window.location.reload()
    })
    // let form = document.querySelector('form')
    // form.reset()
}

function initLapTimeField(){//yoinked graciously from https://f1laps.com
    var lapTimeField = document.getElementsByClassName('lapTimeField');
    for (var i = 0; i < lapTimeField.length; i++) {
        lapTimeField[i].addEventListener('input', function (e) {
            if (e.keyCode != 8) {
                var reg = /^[0-9:.]+$/;
                var deleteLastInput = false;
                // Test if need to delete because not a digit
                if (!reg.test(this.value)) deleteLastInput = true;
                // Test if need to delete because string length > 8
                if (this.value.length > 8) deleteLastInput = true;
                // Test that first secs digit is 0-5
                if (this.value.length == 3 && this.value.slice(-1) > 5) deleteLastInput = true;
                // Remove manually entered colon
                if (this.value.length == 3 && this.value.slice(-1) == ":") deleteLastInput = true;
                // Remove manually entered dot
                if (this.value.length == 6 && this.value.slice(-1) == ".") deleteLastInput = true;
                // Actually delete last input
                if (deleteLastInput) {
                    this.value = this.value.substr(0, this.value.length - 1);
                    return;
                }
                // Add colon if string length == 1
                if (this.value.length == 1) this.value = this.value + ":";
                // Add dot if string length == 4
                if (this.value.length == 4) this.value = this.value + ".";
            }
        });
    };
}

// function setListener() { //doesnt get called immdiately right now
//     document.getElementById('in').addEventListener("change", event => {
//         if (event.target.value.length > 8) {
//             event.target.value = event.target.value.substring(0, 8)
//         }
//         if (event.target.value.length === 2 && !event.target.value.includes(':')) {
//             event.target.value = event.target.value.slice(0, 1) + ":" + event.target.value.slice(1)
//         }
//         if (event.target.value.length === 5 && !event.target.value.includes('.')) {
//             event.target.value = event.target.value.slice(0, 4) + "." + event.target.value.slice(4)
//         }
//         console.log('here')
//     })
// }