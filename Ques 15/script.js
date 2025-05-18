 const productsEl = document.getElementById('products');
        const searchEl = document.getElementById('search');
        const categoryEl = document.getElementById('category');
        const sortEl = document.getElementById('sort');
        const countEl = document.getElementById('count');

        let allProducts = [];
        let categories = [];

        // Fetch products and categories on load
        async function fetchData() {
            const [productsRes, categoriesRes] = await Promise.all([
                fetch('https://fakestoreapi.com/products'),
                fetch('https://fakestoreapi.com/products/categories')
            ]);
            allProducts = await productsRes.json();
            categories = await categoriesRes.json();
            populateCategories();
            renderProducts();
        }

        function populateCategories() {
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
                categoryEl.appendChild(option);
            });
        }

        function renderProducts() {
            let filtered = allProducts;

            // Search filter
            const searchTerm = searchEl.value.trim().toLowerCase();
            if (searchTerm) {
                filtered = filtered.filter(p => p.title.toLowerCase().includes(searchTerm));
            }

            // Category filter
            const selectedCategory = categoryEl.value;
            if (selectedCategory) {
                filtered = filtered.filter(p => p.category === selectedCategory);
            }

            // Sort
            const sortOrder = sortEl.value;
            filtered = filtered.slice().sort((a, b) => {
                return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
            });

            // Product count
            countEl.textContent = `Showing ${filtered.length} product(s)`;

            // Render
            productsEl.innerHTML = filtered.map(product => `
                <div class="product">
                    <img src="${product.image}" alt="${product.title}">
                    <div class="product-title">${product.title}</div>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-category">${product.category}</div>
                </div>
            `).join('');
        }

        // Event listeners
        searchEl.addEventListener('input', renderProducts);
        categoryEl.addEventListener('change', renderProducts);
        sortEl.addEventListener('change', renderProducts);

        // Initialize
        fetchData();
