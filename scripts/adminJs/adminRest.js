document.addEventListener('DOMContentLoaded', () => {
    const restaurantList = document.getElementById('restaurant-list');
    const addRestaurantBtn = document.getElementById('addRestaurantBtn');
    const addRestaurantModal = document.getElementById('addRestaurantModal');
    const closeAddModal = document.getElementById('closeAddModal');
    const submitAddRestaurant = document.getElementById('submitAddRestaurant');

    const updateRestaurantModal = document.getElementById('updateRestaurantModal');
    const closeUpdateModal = document.getElementById('closeUpdateModal');
    const submitUpdateRestaurant = document.getElementById('submitUpdateRestaurant');
    const updateRestaurantId = document.getElementById('updateRestaurantId');
    const updateName = document.getElementById('updateName');
    const updateLocation = document.getElementById('updateLocation');
    const updateOwnerId = document.getElementById('updateOwnerId');

    const deleteRecipesModal = document.getElementById('deleteRecipesModal');
    const closeDeleteRecipesModal = document.getElementById('closeDeleteRecipesModal');
    const recipesList = document.getElementById('recipes-list');
    let currentRestaurantName = '';

    let users = {};

    function openModal(modal) {
        modal.style.display = 'block';
    }

    function closeModal(modal) {
        modal.style.display = 'none';
    }

    async function fetchUsers() {
        try {
            const response = await fetch('http://localhost/RRMS-BACK-END/userCRUD/getAllUser.php');
            const data = await response.json();
            console.log('Fetched user data:', data); // Debugging

            if (!Array.isArray(data)) {
                throw new Error('Fetched data is not an array');
            }

            data.forEach(user => {
                users[user.user_id] = user.username;
            });
            console.log('Processed users:', users); // Debugging
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    async function fetchRestaurants() {
        try {
            await fetchUsers();
            const response = await fetch('http://localhost/RRMS-BACK-END/restCRUD/getAllRest.php');
            const restaurants = await response.json();
            console.log('Fetched restaurants:', restaurants); // Debugging

            if (!Array.isArray(restaurants)) {
                throw new Error('Fetched restaurants data is not an array');
            }

            restaurantList.innerHTML = '';

            for (const restaurant of restaurants) {
                const ownerUsername = users[restaurant.owner_id] || 'Unknown';

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${restaurant.name}</td>
                    <td>${restaurant.location}</td>
                    <td>${ownerUsername}</td>
                    <td class="actions">
                        <button class="update-btn" data-id="${restaurant.restaurant_id}">Update</button>
                        <button class="delete-btn" data-id="${restaurant.restaurant_id}">Delete</button>
                        <button class="delete-recipes-btn" data-id="${restaurant.restaurant_id}" data-name="${restaurant.name}">Delete Recipes</button>
                    </td>
                `;
                restaurantList.appendChild(row);
            }

            document.querySelectorAll('.update-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const restaurantId = event.target.getAttribute('data-id');
                    openUpdateModal(restaurantId);
                });
            });

            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const restaurantId = event.target.getAttribute('data-id');
                    await deleteRestaurant(restaurantId);
                });
            });

            document.querySelectorAll('.delete-recipes-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const restaurantId = event.target.getAttribute('data-id');
                    currentRestaurantName = event.target.getAttribute('data-name');
                    openDeleteRecipesModal(restaurantId);
                });
            });
        } catch (error) {
            console.error('Error fetching restaurants:', error);
        }
    }

    async function addRestaurant(name, location, ownerUsername) {
        try {
            const ownerId = Object.keys(users).find(id => users[id] === ownerUsername);
            console.log('Owner ID for adding:', ownerId); // Debugging

            if (!ownerId) {
                alert('Owner not found');
                return;
            }

            const response = await fetch('http://localhost/RRMS-BACK-END/restCRUD/addRest.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, location, owner_id: ownerId })
            });
            const result = await response.json();
            console.log(result);
            closeModal(addRestaurantModal);
            fetchRestaurants();
        } catch (error) {
            console.error('Error adding restaurant:', error);
        }
    }

    async function openUpdateModal(restaurantId) {
        try {
            const response = await fetch('http://localhost/RRMS-BACK-END/restCRUD/getOneRest.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: restaurantId })
            });
            const restaurant = await response.json();
            const ownerUsername = users[restaurant.owner_id] || 'Unknown';
            console.log('Owner username for updating:', ownerUsername); // Debugging

            updateRestaurantId.value = restaurantId;
            updateName.value = restaurant.name;
            updateLocation.value = restaurant.location;
            updateOwnerId.value = ownerUsername;

            openModal(updateRestaurantModal);
        } catch (error) {
            console.error('Error fetching restaurant details:', error);
        }
    }

    async function updateRestaurant(restaurantId, name, location, ownerUsername) {
        try {
            const ownerId = Object.keys(users).find(id => users[id] === ownerUsername);
            console.log('Owner ID for updating:', ownerId); // Debugging

            if (!ownerId) {
                alert('Owner not found');
                return;
            }

            const response = await fetch('http://localhost/RRMS-BACK-END/restCRUD/updateRest.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: restaurantId, name, location, owner_id: ownerId })
            });
            const result = await response.json();
            console.log(result);
            closeModal(updateRestaurantModal);
            fetchRestaurants();
        } catch (error) {
            console.error('Error updating restaurant:', error);
        }
    }

    async function deleteRestaurant(restaurantId) {
        try {
            const response = await fetch('http://localhost/RRMS-BACK-END/restCRUD/deleteRest.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: restaurantId })
            });
            const result = await response.json();
            console.log(result);
            fetchRestaurants();
        } catch (error) {
            console.error('Error deleting restaurant:', error);
        }
    }

    async function openDeleteRecipesModal(restaurantId) {
        try {
            const response = await fetch('http://localhost/RRMS-BACK-END/recipeCRUD/getAllRecipe.php');
            const allRecipes = await response.json();
            const recipes = allRecipes.filter(recipe => recipe.restaurant_id == restaurantId);
            console.log('Fetched recipes:', recipes); // Debugging

            recipesList.innerHTML = `<h2>Delete Recipes for ${currentRestaurantName}</h2>`;
            for (const recipe of recipes) {
                const recipeElement = document.createElement('div');
                recipeElement.innerHTML = `
                    <p>${recipe.name}</p>
                    <button class="delete-recipe-btn" data-id="${recipe.recipe_id}">Delete</button>
                `;
                recipesList.appendChild(recipeElement);
            }

            document.querySelectorAll('.delete-recipe-btn').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const recipeId = event.target.getAttribute('data-id');
                    await deleteRecipe(recipeId);
                    event.target.parentElement.remove();
                });
            });

            openModal(deleteRecipesModal);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    }

    async function deleteRecipe(recipeId) {
        try {
            const response = await fetch('http://localhost/RRMS-BACK-END/recipeCRUD/deleteRecipe.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: recipeId })
            });
            const result = await response.json();
            console.log(result);
            fetchRestaurants();
        } catch (error) {
            console.error('Error deleting recipe:', error);
        }
    }

    addRestaurantBtn.addEventListener('click', () => {
        openModal(addRestaurantModal);
    });

    closeAddModal.addEventListener('click', () => {
        closeModal(addRestaurantModal);
    });

    closeUpdateModal.addEventListener('click', () => {
        closeModal(updateRestaurantModal);
    });

    closeDeleteRecipesModal.addEventListener('click', () => {
        closeModal(deleteRecipesModal);
    });

    submitAddRestaurant.addEventListener('click', () => {
        const name = document.getElementById('addName').value;
        const location = document.getElementById('addLocation').value;
        const ownerUsername = document.getElementById('addOwnerId').value;
        addRestaurant(name, location, ownerUsername);
    });

    submitUpdateRestaurant.addEventListener('click', () => {
        const restaurantId = updateRestaurantId.value;
        const name = updateName.value || undefined;
        const location = updateLocation.value || undefined;
        const ownerUsername = updateOwnerId.value || undefined;
        updateRestaurant(restaurantId, name, location, ownerUsername);
    });

    fetchRestaurants();
});
