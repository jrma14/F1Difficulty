window.onload = () => {    
    let tabs = document.getElementById('header').getElementsByClassName('tab') 
    for (let i = 0; i < tabs.length; i++){
        if(tabs[i].getAttribute('name') === 'list'){
            tabs[i].classList.add('tab-active')
        } else {
            tabs[i].classList.remove('tab-active')
        }
    }
    let card = document.querySelectorAll('#card')
    card.forEach(e => {
        let endpoint = e.getAttribute('data-endpoint')
        let name = e.getAttribute('name')
        e.onclick = () => {
            window.location.href = window.location.href.replace('list',`calculator?name=${name}&endpoint=${endpoint}`)
        }
    })
}