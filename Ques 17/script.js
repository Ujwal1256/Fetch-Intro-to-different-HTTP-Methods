
        // Replace with your actual mockapi.io endpoint
        const API_URL = 'https://68208c34259dad2655ace1fd.mockapi.io/user';

        const studentForm = document.getElementById('studentForm');
        const studentsTable = document.getElementById('studentsTable');
        const loadingDiv = document.getElementById('loading');
        const apiErrorDiv = document.getElementById('apiError');
        const nameInput = document.getElementById('name');
        const ageInput = document.getElementById('age');
        const courseInput = document.getElementById('course');
        const studentIdInput = document.getElementById('studentId');
        const submitBtn = document.getElementById('submitBtn');
        const cancelEditBtn = document.getElementById('cancelEditBtn');
        const nameError = document.getElementById('nameError');
        const ageError = document.getElementById('ageError');
        const formError = document.getElementById('formError');

        // Utility functions
        function showLoading(show) {
            loadingDiv.classList.toggle('d-none', !show);
            studentsTable.parentElement.classList.toggle('loading', show);
        }
        function showApiError(msg) {
            apiErrorDiv.textContent = msg || '';
        }
        function clearForm() {
            studentForm.reset();
            studentIdInput.value = '';
            submitBtn.textContent = 'Add Student';
            cancelEditBtn.classList.add('d-none');
            nameError.textContent = '';
            ageError.textContent = '';
            formError.textContent = '';
        }
        function validateForm() {
            let valid = true;
            nameError.textContent = '';
            ageError.textContent = '';
            formError.textContent = '';
            if (!nameInput.value.trim()) {
                nameError.textContent = 'Name is required.';
                valid = false;
            }
            if (!ageInput.value.trim() || isNaN(ageInput.value) || Number(ageInput.value) <= 0) {
                ageError.textContent = 'Age must be a positive number.';
                valid = false;
            }
            return valid;
        }

        // CRUD Operations
        async function fetchStudents() {
            showLoading(true);
            showApiError('');
            try {
                const res = await fetch(API_URL);
                if (!res.ok) throw new Error('Failed to fetch students');
                const students = await res.json();
                renderStudents(students);
            } catch (err) {
                showApiError(err.message);
            }
            showLoading(false);
        }

        function renderStudents(students) {
            studentsTable.innerHTML = '';
            if (students.length === 0) {
                studentsTable.innerHTML = '<tr><td colspan="4" class="text-center">No students found.</td></tr>';
                return;
            }
            students.forEach(student => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${student.name}</td>
                    <td>${student.age}</td>
                    <td>${student.course || ''}</td>
                    <td>
                        <button class="btn btn-sm btn-warning me-2" onclick="editStudent('${student.id}')">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteStudent('${student.id}')">Delete</button>
                    </td>
                `;
                studentsTable.appendChild(tr);
            });
        }

        // Expose edit/delete for inline onclick
        window.editStudent = function(id) {
            fetch(`${API_URL}/${id}`)
                .then(res => res.json())
                .then(student => {
                    nameInput.value = student.name;
                    ageInput.value = student.age;
                    courseInput.value = student.course || '';
                    studentIdInput.value = student.id;
                    submitBtn.textContent = 'Update Student';
                    cancelEditBtn.classList.remove('d-none');
                });
        };

        window.deleteStudent = async function(id) {
            if (!confirm('Are you sure you want to delete this student?')) return;
            showLoading(true);
            showApiError('');
            try {
                const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                if (!res.ok) throw new Error('Failed to delete student');
                fetchStudents();
            } catch (err) {
                showApiError(err.message);
            }
            showLoading(false);
        };

        cancelEditBtn.addEventListener('click', clearForm);

        studentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            if (!validateForm()) return;
            showLoading(true);
            showApiError('');
            const student = {
                name: nameInput.value.trim(),
                age: Number(ageInput.value),
                course: courseInput.value.trim()
            };
            const id = studentIdInput.value;
            try {
                let res;
                if (id) {
                    // Update
                    res = await fetch(`${API_URL}/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(student)
                    });
                } else {
                    // Create
                    res = await fetch(API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(student)
                    });
                }
                if (!res.ok) throw new Error('Failed to save student');
                clearForm();
                fetchStudents();
            } catch (err) {
                formError.textContent = err.message;
            }
            showLoading(false);
        });

        // Initial load
        fetchStudents();
    