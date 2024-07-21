document.addEventListener("DOMContentLoaded",function(){
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

// Function to hide the modal
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Add Restaurant Modal
const addRestaurantBtn = document.getElementById('addRestaurantBtn');
const closeAddModal = document.getElementById('closeAddModal');
const submitAddRestaurant = document.getElementById('submitAddRestaurant');

if (addRestaurantBtn) {
    addRestaurantBtn.addEventListener('click', () => showModal('addRestaurantModal'));
}

if (closeAddModal) {
    closeAddModal.addEventListener('click', () => hideModal('addRestaurantModal'));
}

if (submitAddRestaurant) {
    submitAddRestaurant.addEventListener('click', () => {
        // Handle form submission for adding a new restaurant
        const name = document.getElementById('addName').value;
        const cuisine = document.getElementById('addCuisine').value;
        const description = document.getElementById('addDescription').value;

        // Perform API call or form submission logic here

        // After submission, hide the modal
        hideModal('addRestaurantModal');
    });
}

// Update Restaurant Modal
const closeUpdateModal = document.getElementById('closeUpdateModal');
const submitUpdateRestaurant = document.getElementById('submitUpdateRestaurant');

if (closeUpdateModal) {
    closeUpdateModal.addEventListener('click', () => hideModal('updateRestaurantModal'));
}

if (submitUpdateRestaurant) {
    submitUpdateRestaurant.addEventListener('click', () => {
        // Handle form submission for updating a restaurant
        const id = document.getElementById('updateRestaurantId').value;
        const name = document.getElementById('updateName').value;
        const location = document.getElementById('updateLocation').value;
        const ownerId = document.getElementById('updateOwnerId').value;

        // Perform API call or form submission logic here

        // After submission, hide the modal
        hideModal('updateRestaurantModal');
    });
}

// Delete Recipes Modal
const closeDeleteRecipesModal = document.getElementById('closeDeleteRecipesModal');

if (closeDeleteRecipesModal) {
    closeDeleteRecipesModal.addEventListener('click', () => hideModal('deleteRecipesModal'));
}

// Optional: If you have a button to show the delete recipes modal
const showDeleteRecipesBtn = document.getElementById('showDeleteRecipesBtn');
if (showDeleteRecipesBtn) {
    showDeleteRecipesBtn.addEventListener('click', () => showModal('deleteRecipesModal'));
}
});
