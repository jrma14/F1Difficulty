window.onload = () => {
    let tabs = document.getElementById('header').getElementsByClassName('tab')
    for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].getAttribute('name') === 'map') {
            tabs[i].classList.add('tab-active')
        } else {
            tabs[i].classList.remove('tab-active')
        }
    }


    document.onclick = (e) => {
        let popup = document.getElementById("popup")
        if (e.target.closest('.location')) {
            popup.classList.remove('hidden')
            let coords = window.getComputedStyle(e.target.closest('.location')).transform
            let arr = coords.replace('matrix(', '').replace(')', '').split(',')
            let finalCoords = `matrix(${arr[0]},${arr[1]},${arr[2]},${arr[3]},${parseInt(arr[4]) + 50},${parseInt(arr[5]) - 142})`
            popup.style.transform = finalCoords
            let data = fetch(`/getdata?endpoint=${e.target.closest('.location').getAttribute('data-endpoint')}`).then(res => res.json()).then(data => {
                popup.innerHTML = data.html
                const buttons = document.querySelectorAll('#popupbtn')
                buttons[1].onclick = submit
                buttons[0].onclick = clear
                initLapTimeField()
            })
        }
        if (!e.target.closest('.popup') && !e.target.closest('.location')) {
            popup.classList.add('hidden')
        }
    }

}

const clear = function (e) {
    e.preventDefault()
    fetch(`/removedifficulty/?track=${document.body.getAttribute('data-endpoint')}`)
        .then(res => {
            let time = document.getElementById('laptime')
            let diff = document.getElementById('difficulty')
            time.textContent = 'no laptime'
            diff.textContent = 'no difficulty'
        })
}

const submit = function (e) {
    e.preventDefault()
    let lapTimeField = document.getElementsByClassName('lapTimeField')[0]
    let laptime = lapTimeField.value
    let form = document.querySelector('form')
    form.reset()
    if (laptime.length !== 8) return
    fetch(`/getdifficulty/?laptime=${laptime}&track=${lapTimeField.getAttribute('data-endpoint')}`)
        .then(res => {
            return res.json()
        })
        .then(json => {
            let time = document.getElementById('laptime')
            let diff = document.getElementById('difficulty')
            time.textContent = json.laptime
            diff.textContent = json.difficulty
        })
}

function initLapTimeField() {//yoinked graciously from https://f1laps.com
    var lapTimeField = document.getElementById('in')
    lapTimeField.addEventListener('input', function (e) {
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

}