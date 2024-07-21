document.addEventListener('DOMContentLoaded', () => {
    const profileLink = document.querySelector('.navbar a[href="#profile"]');
    const favoriteRecipesContainer = document.createElement('div');
    favoriteRecipesContainer.id = 'favoriteRecipesContainer';
    favoriteRecipesContainer.style.display = 'none';
    profileLink.parentNode.appendChild(favoriteRecipesContainer);

    profileLink.addEventListener('click', () => {
        favoriteRecipesContainer.style.display = favoriteRecipesContainer.style.display === 'none' ? 'block' : 'none';
        loadFavoriteRecipes();
    });

    function loadFavoriteRecipes() {
        const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
        favoriteRecipesContainer.innerHTML = '';

        favoriteRecipes.forEach(async recipeId => {
            try {
                const response = await fetch('http://localhost/RRMS-BACK-END/recipeCRUD/getOneRecipe.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: recipeId })
                });
                const recipe = await response.json();
                const restaurantResponse = await fetch('http://localhost/RRMS-BACK-END/restCRUD/getOneRest.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: recipe.restaurant_id })
                });
                const restaurant = await restaurantResponse.json();

                const recipeElement = document.createElement('div');
                recipeElement.classList.add('recipe');
                recipeElement.innerHTML = `
                    <div class="recipe-details">
                        <h3>${recipe.name}</h3>
                        <p>Restaurant: ${restaurant.name}</p>
                    </div>
                `;
                favoriteRecipesContainer.appendChild(recipeElement);
            } catch (error) {
                console.error('Error fetching favorite recipes:', error);
            }
        });
    }
});
