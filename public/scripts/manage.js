document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const productList = document.getElementById('product-list');
    const messageDiv = document.getElementById('message');
    const viewIdInput = document.getElementById('view-id');
    const deleteIdInput = document.getElementById('delete-id');
    const addNameInput = document.getElementById('add-name');
    const addPriceInput = document.getElementById('add-price');
    const updateIdInput = document.getElementById('update-id');
    const updateNameInput = document.getElementById('update-name');
    const updatePriceInput = document.getElementById('update-price');

    // Utility
    function showMessage(text) {
        messageDiv.textContent = text;
        setTimeout(() => (messageDiv.textContent = ''), 3000);
    }

    // Fetch and display all products
    async function loadProducts() {
        const res = await fetch('/api/products');
        const products = await res.json();
        productList.innerHTML = '';

        products.forEach(product => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${product.name}</strong> - $${product.price}
                <button onclick="viewProduct(${product.id})">View</button>
                <button onclick="editProduct(${product.id}, '${product.name}', ${product.price})">Edit</button>
                <button onclick="deleteProduct(${product.id})">Delete</button>
            `;
            productList.appendChild(li);
        });
    }

    // Add product
    document.getElementById('add-button').addEventListener('click', async () => {
        const name = addNameInput.value.trim();
        const price = addPriceInput.value;

        if (!name || !price) return alert('Both name and price are required.');

        const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price })
        });

        if (res.ok) {
            showMessage('Product added successfully!');
            addNameInput.value = '';
            addPriceInput.value = '';
            loadProducts();
        } else {
            const error = await res.json();
            alert(error.error || 'Failed to add product');
        }
    });

    // Update product
    document.getElementById('update-button').addEventListener('click', async () => {
        const id = updateIdInput.value;
        const name = updateNameInput.value.trim();
        const price = updatePriceInput.value;

        if (!id || !name || !price) return alert('All fields are required.');

        const res = await fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price })
        });

        if (res.ok) {
            showMessage('Product updated successfully!');
            updateIdInput.value = '';
            updateNameInput.value = '';
            updatePriceInput.value = '';
            loadProducts();
        } else {
            const error = await res.json();
            alert(error.error || 'Failed to update product');
        }
    });

    // View product by ID
    document.getElementById('view-button').addEventListener('click', async () => {
        const id = viewIdInput.value;
        if (!id) return alert('Please enter a product ID.');

        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) return alert('Product not found');

        const product = await res.json();
        alert(`Name: ${product.name}\nPrice: $${product.price}`);
    });

    // Delete product by ID
    document.getElementById('delete-button').addEventListener('click', async () => {
        const id = deleteIdInput.value;
        if (!id) return alert('Please enter a product ID.');

        const confirmDelete = confirm(`Delete product ${id}?`);
        if (!confirmDelete) return;

        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });

        if (res.ok) {
            alert('Product deleted successfully');
            loadProducts();
        } else {
            const error = await res.json();
            alert(error.error || 'Failed to delete product');
        }
    });

    // Expose to global for inline handlers
    window.editProduct = (id, name, price) => {
        updateIdInput.value = id;
        updateNameInput.value = name;
        updatePriceInput.value = price;
        document.getElementById('update-section').scrollIntoView({ behavior: 'smooth' });
    };

    // Initial load
    loadProducts();
});
