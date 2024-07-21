// document.addEventListener("DOMContentLoaded", function() {
//     const sign_up_form = document.getElementById("sign_up_form");
//     const username = document.getElementById("username");
//     const email = document.getElementById("email");
//     const password = document.getElementById("password");
//     const user_type = document.getElementById("user_type")

    
//     sign_up_form.addEventListener("submit", function(event) {
//         event.preventDefault();
//         submitForm(); 
//     });

//     function submitForm() {
        
//         const data = {
//             username:username.value,
//             email:email.value,
//             password:password.value,
//             user_type:user_type.value
//         };
//         console.log(data);

        
//         fetch('http://localhost/RRMS-BACK-END/userCRUD/sign_up.php', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(data)
//         })
//         .then(response => response.json())
//         .then(result => {
//             console.log('Success:', result);
       
//         })
        
//     }
// });

document.addEventListener("DOMContentLoaded", function() {
    const sign_up_form = document.getElementById("sign_up_form");
    const username = document.getElementById("username");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const user_type = document.getElementById("user_type");
    const restaurantDetails = document.getElementById("restaurant-details");

    user_type.addEventListener("change", function() {
        if (user_type.value === "owner") {
            restaurantDetails.style.display = "block";
        } else {
            restaurantDetails.style.display = "none";
        }
    });

    sign_up_form.addEventListener("submit", function(event) {
        event.preventDefault();
        submitForm();
    });

    function submitForm() {
        const data = {
            username: username.value,
            email: email.value,
            password: password.value,
            user_type: user_type.value,
            restaurant_name: document.getElementById("restaurant_name").value,
            restaurant_location: document.getElementById("restaurant_location").value
        };

        fetch('http://localhost/RRMS-BACK-END/userCRUD/sign_up.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                window.location.href = '/index.html'; // Redirect to login page after successful sign-up
            } else {
                alert('Error: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});
