document.addEventListener("DOMContentLoaded", function() {
    const recipeList = document.getElementById('recipe-list');
    const ownerUsername = document.getElementById('owner-username');
    const addRecipeBtn = document.getElementById('addRecipeBtn');
    const closeAddModal = document.getElementById('closeAddModal');
    const submitAddRecipe = document.getElementById('submitAddRecipe');
    const closeUpdateModal = document.getElementById('closeUpdateModal');
    const submitUpdateRecipe = document.getElementById('submitUpdateRecipe');
    let recipes = [];
    let currentRestaurantId = null;

    // Function to show a modal
    function showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
        }
    }

    // Function to hide a modal
    function hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Function to fetch and display the owner's recipes
    async function fetchRecipes() {
        const ownerId = sessionStorage.getItem('user_id'); // Ensure the session key matches the login script
        if (!ownerId) {
            window.location.href = '/index.html'; // Redirect to login if no userId
            return;
        }

        try {
            const userResponse = await fetch(`http://localhost/RRMS-BACK-END/userCRUD/getOneUser.php?id=${ownerId}`);
            const userData = await userResponse.json();
            ownerUsername.textContent = userData.username;

            const restResponse = await fetch('http://localhost/RRMS-BACK-END/restCRUD/getAllRest.php');
            const allRestaurants = await restResponse.json();
            const ownerRestaurants = allRestaurants.filter(rest => rest.owner_id == ownerId);

            if (ownerRestaurants.length > 0) {
                currentRestaurantId = ownerRestaurants[0].restaurant_id;

                const recipesResponse = await fetch('http://localhost/RRMS-BACK-END/recipeCRUD/getAllRecipe.php');
                const allRecipes = await recipesResponse.json();
                recipes = allRecipes.filter(recipe => recipe.restaurant_id === currentRestaurantId);
                displayRecipes();
            } else {
                recipeList.innerHTML = '<tr><td colspan="5">No restaurants found for this owner.</td></tr>';
            }
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    }

    // Function to display recipes in the table
    function displayRecipes() {
        recipeList.innerHTML = '';
        recipes.forEach(recipe => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${recipe.name}</td>
                <td>${recipe.cuisine_type}</td>
                <td>${recipe.description}</td>
                <td>${recipe.instructions}</td>
                <td class="actions">
                    <button class="update-button" data-id="${recipe.recipe_id}">Update</button>
                    <button class="delete-button" data-id="${recipe.recipe_id}">Delete</button>
                </td>
            `;
            recipeList.appendChild(tr);
        });

        document.querySelectorAll('.update-button').forEach(button => {
            button.addEventListener('click', event => {
                const recipeId = event.target.dataset.id;
                const recipe = recipes.find(r => r.recipe_id == recipeId);
                if (recipe) {
                    document.getElementById('updateRecipeId').value = recipe.recipe_id;
                    document.getElementById('updateName').value = recipe.name;
                    document.getElementById('updateCuisineType').value = recipe.cuisine_type;
                    document.getElementById('updateDescription').value = recipe.description;
                    document.getElementById('updateInstructions').value = recipe.instructions;
                    showModal('updateRecipeModal');
                }
            });
        });

        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', event => {
                const recipeId = event.target.dataset.id;
                deleteRecipe(recipeId);
            });
        });
    }

    // Function to add a new recipe
    async function addRecipe() {
        const name = document.getElementById('addName').value;
        const cuisineType = document.getElementById('addCuisineType').value;
        const description = document.getElementById('addDescription').value;
        const instructions = document.getElementById('addInstructions').value;

        const data = {
            name,
            cuisine_type: cuisineType,
            description,
            instructions,
            restaurant_id: currentRestaurantId
        };

        try {
            const response = await fetch('http://localhost/RRMS-BACK-END/recipeCRUD/addRecipe.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            console.log('Recipe added:', result);
            hideModal('addRecipeModal');
            fetchRecipes();
        } catch (error) {
            console.error('Error adding recipe:', error);
        }
    }

    // Function to update a recipe
    async function updateRecipe() {
        const recipeId = document.getElementById('updateRecipeId').value;
        const name = document.getElementById('updateName').value;
        const cuisineType = document.getElementById('updateCuisineType').value;
        const description = document.getElementById('updateDescription').value;
        const instructions = document.getElementById('updateInstructions').value;

        const data = {
            recipe_id: recipeId,
            name,
            cuisine_type: cuisineType,
            description,
            instructions
        };

        try {
            const response = await fetch('http://localhost/RRMS-BACK-END/recipeCRUD/updateRecipe.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            console.log('Recipe updated:', result);
            hideModal('updateRecipeModal');
            fetchRecipes();
        } catch (error) {
            console.error('Error updating recipe:', error);
        }
    }

    // Function to delete a recipe
    async function deleteRecipe(recipeId) {
        try {
            const response = await fetch('http://localhost/RRMS-BACK-END/recipeCRUD/deleteRecipe.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ recipe_id: recipeId })
            });
            const result = await response.json();
            console.log('Recipe deleted:', result);
            recipes = recipes.filter(recipe => recipe.recipe_id != recipeId);
            displayRecipes();
        } catch (error) {
            console.error('Error deleting recipe:', error);
        }
    }

    // Event listeners for modals and buttons
    if (addRecipeBtn) addRecipeBtn.addEventListener('click', () => showModal('addRecipeModal'));
    if (closeAddModal) closeAddModal.addEventListener('click', () => hideModal('addRecipeModal'));
    if (submitAddRecipe) submitAddRecipe.addEventListener('click', addRecipe);
    if (closeUpdateModal) closeUpdateModal.addEventListener('click', () => hideModal('updateRecipeModal'));
    if (submitUpdateRecipe) submitUpdateRecipe.addEventListener('click', updateRecipe);

    fetchRecipes();
});
