document.addEventListener("DOMContentLoaded", function() {
    const sign_up_form = document.getElementById("sign_up_form");
    const username = document.getElementById("username");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const user_type = document.getElementById("user_type")

    
    sign_up_form.addEventListener("submit", function(event) {
        event.preventDefault();
        submitForm(); 
    });

    function submitForm() {
        
        const data = {
            username:username.value,
            email:email.value,
            password:password.value,
            user_type:user_type.value
        };
        console.log(data);

        
        fetch('http://localhost/api/sign_up.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            console.log('Success:', result);
       
        })
        
    }
});