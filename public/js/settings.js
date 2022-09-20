window.onload = () => {
    let themeselector = document.querySelector('#themeselector')
    let theme = document.getElementById('html').getAttribute('data-theme')
    themeselector.value = theme
    themeselector.addEventListener('change', (e) => {
        fetch(`/changetheme?theme=${themeselector.value}`).then(() => {
            window.location.reload()
        })
    })
}