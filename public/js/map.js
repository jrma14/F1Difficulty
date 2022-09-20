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
        if(e.target.closest(".popup") || e.target.closest('.location')) return
        for (let j = 0; j < bubbles.length; j++) {
            let popups = document.getElementsByClassName("popup")
            for( let i = 0; i < popups.length; i++){
                popups[i].classList.add("hidden")
            }

        }
    }
    
    let bubbles = document.getElementsByClassName('location')
    for (let i = 0; i < bubbles.length; i++) {
        bubbles[i].onclick = (e) => {
            for (let j = 0; j < bubbles.length; j++) {
                let popup = document.getElementById(bubbles[j].getAttribute('data-endpoint') + 'popup')
                if(bubbles[j].getAttribute('data-endpoint') === bubbles[i].getAttribute('data-endpoint')){
                    popup.classList.remove('hidden')
                } else {
                    popup.classList.add('hidden')
                }
            }
        }
    }
}