document.addEventListener('DOMContentLoaded', () => {
    const recipesContainer = document.getElementById('recipes-container');
    const recipeModal = document.getElementById('recipeModal');
    const closeModal = document.getElementById('closeModal');
    const favoriteStar = document.getElementById('favoriteStar');
    const recipeDetails = document.getElementById('recipe-details');

    if (!recipesContainer || !recipeModal || !closeModal || !favoriteStar || !recipeDetails) {
        console.error('One or more elements not found in the DOM');
        return;
    }

    let favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];

    // Function to fetch and display recipes
    async function fetchRecipes() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const query = urlParams.get('query');

        try {
            const response = await fetch('http://localhost/RRMS-BACK-END/recipeCRUD/getAllRecipe.php');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const allRecipes = await response.json();
            const filteredRecipes = allRecipes.filter(recipe => recipe.cuisine_type === query);

            filteredRecipes.forEach(recipe => {
                const recipeElement = document.createElement('div');
                recipeElement.classList.add('recipe');
                recipeElement.innerHTML = `
                    <div class="recipe-details">
                        <h3>${recipe.name}</h3>
                        <p>Restaurant ID: ${recipe.restaurant_id}</p>
                    </div>
                    <button class="recipe-button" data-id="${recipe.recipe_id}">Details</button>
                `;
                recipesContainer.appendChild(recipeElement);
            });

            document.querySelectorAll('.recipe-button').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const recipeId = event.target.getAttribute('data-id');
                    await showRecipeDetails(recipeId);
                });
            });
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    }

    // Function to show recipe details in modal
    async function showRecipeDetails(recipeId) {
        try {
            const response = await fetch('http://localhost/RRMS-BACK-END/recipeCRUD/getOneRecipe.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: recipeId })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const recipe = await response.json();
            recipeDetails.innerHTML = `
                <h2>${recipe.name}</h2>
                <p><strong>Cuisine Type:</strong> ${recipe.cuisine_type}</p>
                <p><strong>Description:</strong> ${recipe.description}</p>
                <p><strong>Instructions:</strong> ${recipe.instructions}</p>
            `;
            favoriteStar.setAttribute('data-id', recipeId);
            favoriteStar.classList.remove('gold');
            favoriteStar.classList.add('gray');
            if (favoriteRecipes.includes(recipeId)) {
                favoriteStar.classList.remove('gray');
                favoriteStar.classList.add('gold');
            }
            recipeModal.style.display = 'block';
        } catch (error) {
            console.error('Error fetching recipe details:', error);
        }
    }

    // Close the modal
    closeModal.addEventListener('click', () => {
        recipeModal.style.display = 'none';
    });

    // Toggle favorite
    favoriteStar.addEventListener('click', () => {
        const recipeId = favoriteStar.getAttribute('data-id');
        if (favoriteStar.classList.contains('gray')) {
            favoriteStar.classList.remove('gray');
            favoriteStar.classList.add('gold');
            favoriteRecipes.push(recipeId);
        } else {
            favoriteStar.classList.remove('gold');
            favoriteStar.classList.add('gray');
            favoriteRecipes = favoriteRecipes.filter(id => id !== recipeId);
        }
        localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));
    });

    fetchRecipes();
});
