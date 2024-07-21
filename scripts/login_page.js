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

        fetch(`http://localhost/api/login.php?${queryParams}`, {
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
                switch (result.user_type) {
                    case 'admin':
                        window.location.href = '/admin_dashboard.html';
                        break;
                    case 'owner':
                        window.location.href = '/owner_dashboard.html';
                        break;
                    case 'client':
                        window.location.href = '/search_page.html';
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
