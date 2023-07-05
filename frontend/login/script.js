function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const data = {
        email: email,
        password: password
    }

    console.log(data);

    fetch('http://10.62.149.206:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data,
    }).then((response) => {
        alert(response[0]);
    }).then((data) => {
        console.log(data);
        if (data[0].content == undefined) {
            window.location.href = 'http://127.0.0.1:5500/frontend/home';
        }
        else {
            alert(data.message);
        }
    }).catch((err) => {
        alert(err);
    })
}

// dom content loaded
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("loginform");

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        login();
    });
});