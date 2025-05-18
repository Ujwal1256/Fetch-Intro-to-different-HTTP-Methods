  
      // --- Firebase Config (Replace with your own) ---
      const firebaseConfig = {
        apiKey: "AIzaSyCmDQjea7464YFwrYSoqKP_4yrVrySLruE",
        authDomain: "fir-demo-de05f.firebaseapp.com",
        databaseURL:
          "https://fir-demo-de05f-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "fir-demo-de05f",
        storageBucket: "fir-demo-de05f.firebasestorage.app",
        messagingSenderId: "462913258501",
        appId: "1:462913258501:web:5cafe79a7b3827e9e0486c",
      };
      firebase.initializeApp(firebaseConfig);
      const db = firebase.database().ref("students");

      // --- Theme Toggle ---
      const themeToggle = document.getElementById("theme-toggle");
      function setTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
      }
      themeToggle.onclick = () => {
        const current = localStorage.getItem("theme") || "light";
        setTheme(current === "light" ? "dark" : "light");
      };
      // On load
      setTheme(localStorage.getItem("theme") || "light");

      // --- State ---
      let students = [];
      let editingId = null;

      // --- Controls ---
      const searchInput = document.getElementById("search");
      const filterEnrolled = document.getElementById("filter-enrolled");
      const filterGrade = document.getElementById("filter-grade");
      const sortBy = document.getElementById("sort-by");

      // --- Persisted Filters/Sort ---
      function saveFilters() {
        localStorage.setItem(
          "filters",
          JSON.stringify({
            enrolled: filterEnrolled.value,
            grade: filterGrade.value,
            sort: sortBy.value,
          })
        );
      }
      function loadFilters() {
        const filters = JSON.parse(localStorage.getItem("filters") || "{}");
        if (filters.enrolled) filterEnrolled.value = filters.enrolled;
        if (filters.grade) filterGrade.value = filters.grade;
        if (filters.sort) sortBy.value = filters.sort;
      }
      loadFilters();

      // --- CRUD ---
      function renderStudents() {
        let filtered = students.slice();

        // Search
        const search = searchInput.value.trim().toLowerCase();
        if (search) {
          filtered = filtered.filter((s) =>
            s.name.toLowerCase().includes(search)
          );
        }

        // Filter Enrolled
        if (filterEnrolled.value === "enrolled") {
          filtered = filtered.filter((s) => s.enrolled);
        } else if (filterEnrolled.value === "not-enrolled") {
          filtered = filtered.filter((s) => !s.enrolled);
        }

        // Filter Grade
        if (filterGrade.value !== "all") {
          filtered = filtered.filter((s) => s.grade === filterGrade.value);
        }

        // Sort
        if (sortBy.value === "name-asc") {
          filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy.value === "age-asc") {
          filtered.sort((a, b) => a.age - b.age);
        } else if (sortBy.value === "age-desc") {
          filtered.sort((a, b) => b.age - a.age);
        }

        // Render
        const tbody = document.getElementById("students-tbody");
        tbody.innerHTML = "";
        for (const s of filtered) {
          const tr = document.createElement("tr");
          tr.innerHTML = `
                    <td>${s.name}</td>
                    <td>${s.age}</td>
                    <td>${s.grade}</td>
                    <td>${s.enrolled ? "Yes" : "No"}</td>
                    <td class="actions">
                        <button onclick="editStudent('${s.id}')">Edit</button>
                        <button onclick="deleteStudent('${
                          s.id
                        }')">Delete</button>
                    </td>
                `;
          tbody.appendChild(tr);
        }
      }

      // --- Firebase Sync ---
      db.on("value", (snap) => {
        students = [];
        snap.forEach((child) => {
          students.push({ id: child.key, ...child.val() });
        });
        renderStudents();
      });

      // --- Add/Edit Student ---
      document.getElementById("student-form").onsubmit = function (e) {
        e.preventDefault();
        const name = document.getElementById("name").value.trim();
        const age = parseInt(document.getElementById("age").value, 10);
        const grade = document.getElementById("grade").value;
        const enrolled = document.getElementById("enrolled").checked;
        if (!name || !age || !grade) return;

        const student = { name, age, grade, enrolled };
        if (editingId) {
          db.child(editingId).set(student);
          editingId = null;
          document.getElementById("submit-btn").textContent = "Add Student";
        } else {
          db.push(student);
        }
        this.reset();
        document.getElementById("student-id").value = "";
      };

      // --- Edit/Delete Handlers (global for inline onclick) ---
      window.editStudent = function (id) {
        const s = students.find((s) => s.id === id);
        if (!s) return;
        document.getElementById("name").value = s.name;
        document.getElementById("age").value = s.age;
        document.getElementById("grade").value = s.grade;
        document.getElementById("enrolled").checked = s.enrolled;
        editingId = id;
        document.getElementById("submit-btn").textContent = "Update Student";
        document.getElementById("student-id").value = id;
      };
      window.deleteStudent = function (id) {
        if (confirm("Delete this student?")) {
          db.child(id).remove();
        }
      };

      // --- Controls Events ---
      [searchInput, filterEnrolled, filterGrade, sortBy].forEach((el) => {
        el.addEventListener("input", () => {
          saveFilters();
          renderStudents();
        });
        el.addEventListener("change", () => {
          saveFilters();
          renderStudents();
        });
      });
    