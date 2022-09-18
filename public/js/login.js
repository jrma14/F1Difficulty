window.onload = (e) => {
    let form = document.querySelector("#login")
    form.onsubmit = (e) => {
        e.preventDefault()
        let data = {
            username: document.querySelector('#username').value,
            password: document.querySelector('#password').value
        }
        fetch('/login/username', {  
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        })
        form.reset()
    }
}