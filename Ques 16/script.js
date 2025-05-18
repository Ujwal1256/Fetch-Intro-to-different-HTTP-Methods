       // TODO: Replace with your own Firebase config
  const firebaseConfig = {
  apiKey: "AIzaSyBbm9Qg7rsczS56xMj86IA5mtJiKwgJ9e8",
  authDomain: "blockuser-bfbbe.firebaseapp.com",
  databaseURL: "https://blockuser-bfbbe-default-rtdb.firebaseio.com",
  projectId: "blockuser-bfbbe",
  storageBucket: "blockuser-bfbbe.firebasestorage.app",
  messagingSenderId: "88809092078",
  appId: "1:88809092078:web:87766545d445b14ac614ff",
  measurementId: "G-MQY3BFNP8W"
};

        firebase.initializeApp(firebaseConfig);
        const db = firebase.database();
        const usersRef = db.ref('users');

        const userForm = document.getElementById('userForm');
        const usersList = document.getElementById('usersList');
        const spinner = document.getElementById('spinner');

        // Show/hide spinner
        function showSpinner(show) {
            spinner.style.display = show ? 'flex' : 'none';
        }

        // Render users
        function renderUsers(users) {
            let html = `
                <table class="table table-bordered table-striped align-middle">
                    <thead>
                        <tr>
                            <th>Name</th><th>Email</th><th style="width:150px">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            for (const id in users) {
                const user = users[id];
                html += `
                    <tr>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>
                            <button class="btn btn-sm btn-warning me-2" onclick="editUser('${id}', '${user.name}', '${user.email}')">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteUser('${id}')">Delete</button>
                        </td>
                    </tr>
                `;
            }
            html += '</tbody></table>';
            usersList.innerHTML = html;
        }

        // Fetch users
        function fetchUsers() {
            showSpinner(true);
            usersRef.on('value', snapshot => {
                showSpinner(false);
                const users = snapshot.val() || {};
                renderUsers(users);
            });
        }

        // Add user
        userForm.addEventListener('submit', e => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            if (!name || !email) return;
            showSpinner(true);
            usersRef.push({ name, email }, err => {
                showSpinner(false);
                if (!err) userForm.reset();
            });
        });

        // Delete user
        window.deleteUser = function(id) {
            if (confirm('Delete this user?')) {
                showSpinner(true);
                usersRef.child(id).remove(() => showSpinner(false));
            }
        };

        // Edit user (open modal)
        window.editUser = function(id, name, email) {
            document.getElementById('editUserId').value = id;
            document.getElementById('editName').value = name;
            document.getElementById('editEmail').value = email;
            new bootstrap.Modal(document.getElementById('editModal')).show();
        };

        // Update user
        document.getElementById('editForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const id = document.getElementById('editUserId').value;
            const name = document.getElementById('editName').value.trim();
            const email = document.getElementById('editEmail').value.trim();
            if (!name || !email) return;
            showSpinner(true);
            usersRef.child(id).update({ name, email }, err => {
                showSpinner(false);
                if (!err) bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
            });
        });

        // Initial fetch
        fetchUsers();
