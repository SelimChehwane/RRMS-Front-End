document.addEventListener("DOMContentLoaded", function() {
    const login_form = document.getElementById("login_form");
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    login_form.addEventListener("submit", function(event) {
        event.preventDefault();
        submitForm();
    });

    function submitForm() {
        const queryParams = new URLSearchParams({
            email: email.value,
            password: password.value
        }).toString();

        fetch(`http://localhost/RRMS-BACK-END/userCRUD/login.php?${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(result => {
            if (result.error) {
                alert(result.error); 
            } else {
                sessionStorage.setItem('user_id', result.user_id); // Store user_id in sessionStorage
                sessionStorage.setItem('user_type', result.user_type); // Store user_type in sessionStorage
                switch (result.user_type) {
                    case 'admin':
                        window.location.href = '../pages/adminDashRest.html';
                        break;
                    case 'owner':
                        window.location.href = '../pages/ownerDash.html';
                        break;
                    case 'client':
                        window.location.href = '../pages/landing.html';
                        break;
                    default:
                        alert('Unknown user type.');
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});
