window.onload = (e) => {
    let button = document.querySelector('#submit')
    button.addEventListener("click",(e) => {
        fetch("/login/google").then(res => {
            debugger
            console.log(res)
        })
    })
}