function checkLoggedIn() {
    return true;
}

document.addEventListener('DOMContentLoaded', function() {
    const loggedIn = document.querySelectorAll('.loggedIn');

    if (checkLoggedIn()) {
        const notLoggedIn = document.querySelectorAll('.notLoggedIn');
        notLoggedIn.forEach(element => {
            element.style.display = 'none';
        });
        loggedIn.forEach(element => {
            element.style.display = 'block';
        });
    } else {
        loggedIn.forEach(element => {
            element.style.display = 'none';
        });
    }
});