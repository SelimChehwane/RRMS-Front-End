document.addEventListener('DOMContentLoaded', () => {
    const userList = document.getElementById('user-list');
    const addUserBtn = document.getElementById('addUserBtn');
    const addUserModal = document.getElementById('addUserModal');
    const closeAddModal = document.getElementById('closeAddModal');
    const submitAddUser = document.getElementById('submitAddUser');

    const updateUserModal = document.getElementById('updateUserModal');
    const closeUpdateModal = document.getElementById('closeUpdateModal');
    const submitUpdateUser = document.getElementById('submitUpdateUser');
    const updateUserId = document.getElementById('updateUserId');
    const updateUsername = document.getElementById('updateUsername');
    const updateEmail = document.getElementById('updateEmail');
    const updatePassword = document.getElementById('updatePassword');
    const updateUserType = document.getElementById('updateUserType');

    function openModal(modal) {
        modal.style.display = 'block';
    }

    function closeModal(modal) {
        modal.style.display = 'none';
    }

    async function fetchUsers() {
        try {
            const response = await fetch('http://localhost/RRMS-BACK-END/userCRUD/getAllUser.php');
            const users = await response.json();
            console.log('Fetched users:', users); // Debugging

            if (!Array.isArray(users)) {
                throw new Error('Fetched users data is not an array');
            }

            userList.innerHTML = '';

            for (const user of users) {
                const userType = user.user_type === 1 ? 'Admin' : user.user_type === 2 ? 'Client' : 'Owner';
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.username}</td>
                    <td>${userType}</td>
                    <td class="actions">
                        <button class="update-btn" data-id="${user.user_id}">Update</button>
                        <button class="delete-btn" data-id="${user.user_id}">Delete</button>
                    </td>
                `;
                userList.appendChild(row);
            }

            document.querySelectorAll('.update-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const userId = event.target.getAttribute('data-id');
                    openUpdateModal(userId);
                });
            });

            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const userId = event.target.getAttribute('data-id');
                    await deleteUser(userId);
                });
            });
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    async function addUser(username, email, password, userType) {
        try {
            const response = await fetch('http://localhost/RRMS-BACK-END/userCRUD/addUser.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password, user_type: userType })
            });
            const result = await response.json();
            console.log(result);
            closeModal(addUserModal);
            fetchUsers();
        } catch (error) {
            console.error('Error adding user:', error);
        }
    }

    async function openUpdateModal(userId) {
        try {
            const response = await fetch('http://localhost/RRMS-BACK-END/userCRUD/getOneUser.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: userId })
            });
            const user = await response.json();
            console.log('Fetched user:', user); // Debugging

            updateUserId.value = userId;
            updateUsername.value = user.username;
            updateEmail.value = user.email;
            updatePassword.value = ''; // Leave empty for the user to fill if they want to change the password
            updateUserType.value = user.user_type;

            openModal(updateUserModal);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    }

    async function updateUser(userId, username, email, password, userType) {
        try {
            const response = await fetch('http://localhost/RRMS-BACK-END/userCRUD/updateUser.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: userId, username, email, password, user_type: userType })
            });
            const result = await response.json();
            console.log(result);
            closeModal(updateUserModal);
            fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    }

    async function deleteUser(userId) {
        try {
            const response = await fetch('http://localhost/RRMS-BACK-END/userCRUD/deleteUser.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: userId })
            });
            const result = await response.json();
            console.log(result);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }

    addUserBtn.addEventListener('click', () => {
        openModal(addUserModal);
    });

    closeAddModal.addEventListener('click', () => {
        closeModal(addUserModal);
    });

    closeUpdateModal.addEventListener('click', () => {
        closeModal(updateUserModal);
    });

    submitAddUser.addEventListener('click', () => {
        const username = document.getElementById('addUsername').value;
        const email = document.getElementById('addEmail').value;
        const password = document.getElementById('addPassword').value;
        const userType = document.getElementById('addUserType').value;
        addUser(username, email, password, userType);
    });

    submitUpdateUser.addEventListener('click', () => {
        const userId = updateUserId.value;
        const username = updateUsername.value || undefined;
        const email = updateEmail.value || undefined;
        const password = updatePassword.value || undefined;
        const userType = updateUserType.value;
        updateUser(userId, username, email, password, userType);
    });

    fetchUsers();
});
