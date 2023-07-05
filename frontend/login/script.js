function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const data = {
        email: email,
        password: password
    }

    fetch('http://10.62.149.206:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }).then((response) => {
        response.json();
        if(response.status == 200) {
            window.location.href = 'http://127.0.0.1:5500/frontend/';
        }
    }).catch((err) => {
        console.log(err);
    })
}

// dom content loaded
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById("loginform");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        login();
    });
});