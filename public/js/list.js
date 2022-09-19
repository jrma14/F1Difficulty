window.onload = () => {
    let card = document.querySelectorAll('#card')
    card.forEach(e => {
        let name = e.getAttribute('name')
        e.onclick = () => {
            window.location.href = window.location.href.replace('list',`calculator?name=${name}`)
        }
    })
}