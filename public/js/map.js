window.onload = () => {
    let tabs = document.getElementById('header').getElementsByClassName('tab') 
    for (let i = 0; i < tabs.length; i++){
        if(tabs[i].getAttribute('name') === 'map'){
            tabs[i].classList.add('tab-active')
        } else {
            tabs[i].classList.remove('tab-active')
        }
    }
}