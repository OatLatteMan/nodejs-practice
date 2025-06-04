document.getElementById('backendSelect')?.addEventListener('change', () => {
    loadProducts(); // reload products with new backend
});


function getApiBase() {
    const backend = document.getElementById('backendSelect')?.value || 'fs';
    return backend === 'lowdb' ? '/api/lowdb-products' : '/api/products';
}

async function loadProducts() {
    try {
        const res = await fetch(getApiBase());
        const products = await res.json();

        const manageList = document.getElementById('product-list');
        const allList = document.getElementById('productsList');

        if (manageList) {
            manageList.innerHTML = '';
            products.forEach(product => {
                const li = document.createElement('li');
                li.innerHTML = `
          <strong>${product.name}</strong> - $${product.price}
          <button onclick="viewProduct(${product.id})">View</button>
          <button onclick="editProduct(${product.id}, '${product.name}', ${product.price})">Edit</button>
          <button onclick="deleteProduct(${product.id})">Delete</button>
        `;
                manageList.appendChild(li);
            });
        }

        if (allList) {
            allList.innerHTML = '';
            products.forEach(p => {
                const li = document.createElement('li');
                li.textContent = `ID: ${p.id} — ${p.name} ($${p.price})`;
                allList.appendChild(li);
            });
        }
    } catch (err) {
        console.error('Failed to load products:', err);
    }
}

function showMessage(msg, isError = false) {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.textContent = msg;
        messageDiv.style.color = isError ? 'red' : 'green';
        setTimeout(() => (messageDiv.textContent = ''), 3000);
    }
}

async function addProduct() {
    const name = document.getElementById('add-name')?.value.trim();
    const price = parseFloat(document.getElementById('add-price')?.value);

    if (!name || isNaN(price)) return showMessage('Please enter valid name and price.', true);

    const res = await fetch(getApiBase(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price }),
    });

    if (res.ok) {
        showMessage('Product added!');
        document.getElementById('add-name').value = '';
        document.getElementById('add-price').value = '';
        loadProducts();
    } else {
        const err = await res.json();
        showMessage(err.error || 'Failed to add product', true);
    }
}

async function deleteProduct(id) {
    if (!confirm(`Delete product ${id}?`)) return;

    const res = await fetch(`${getApiBase()}/${id}`, { method: 'DELETE' });

    if (res.ok) {
        showMessage('Product deleted successfully!');
        loadProducts();
    } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete product');
    }
}

async function viewProduct(id) {
    const res = await fetch(`${getApiBase()}/${id}`);
    if (!res.ok) return alert('Product not found');

    const product = await res.json();
    alert(`Name: ${product.name}\nPrice: $${product.price}`);
}

function editProduct(id, name, price) {
    document.getElementById('update-id').value = id;
    document.getElementById('update-name').value = name;
    document.getElementById('update-price').value = price;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function updateProduct() {
    const id = parseInt(document.getElementById('update-id')?.value);
    const name = document.getElementById('update-name')?.value.trim();
    const price = parseFloat(document.getElementById('update-price')?.value);

    if (isNaN(id) || !name || isNaN(price)) return showMessage('Invalid update input.', true);

    const res = await fetch(`${getApiBase()}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price }),
    });

    if (res.ok) {
        showMessage('Product updated!');
        document.getElementById('update-id').value = '';
        document.getElementById('update-name').value = '';
        document.getElementById('update-price').value = '';
        loadProducts();
    } else {
        const err = await res.json();
        showMessage(err.error || 'Failed to update product', true);
    }
}

function handleViewProduct() {
    const id = parseInt(document.getElementById('view-id')?.value);
    if (!isNaN(id)) {
        viewProduct(id);
    } else {
        alert('Please enter a valid Product ID.');
    }
}

function handleDeleteProduct() {
    const id = parseInt(document.getElementById('delete-id')?.value);
    if (!isNaN(id)) {
        deleteProduct(id);
    } else {
        alert('Please enter a valid Product ID.');
    }
}

async function searchProducts() {
    const query = document.getElementById('search-query')?.value.trim();
    const min = document.getElementById('min-price')?.value;
    const max = document.getElementById('max-price')?.value;
    const resultList = document.getElementById('search-results');
    resultList.innerHTML = '';

    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (min) params.append('minPrice', min);
    if (max) params.append('maxPrice', max);

    try {
        const res = await fetch(`${getApiBase()}/search?${params.toString()}`);
        const results = await res.json();

        if (!res.ok) {
            return resultList.innerHTML = `<li>Error: ${results.error}</li>`;
        }

        if (results.length === 0) {
            resultList.innerHTML = '<li>No products found.</li>';
        } else {
            results.forEach(p => {
                const li = document.createElement('li');
                li.textContent = `ID: ${p.id} — ${p.name} ($${p.price})`;
                resultList.appendChild(li);
            });
        }
    } catch (err) {
        console.error('Search failed:', err);
        resultList.innerHTML = '<li>Something went wrong during search.</li>';
    }
}

// Event listeners (safe with optional chaining)
document.getElementById('search-button')?.addEventListener('click', searchProducts);
document.getElementById('add-button')?.addEventListener('click', addProduct);
document.getElementById('update-button')?.addEventListener('click', updateProduct);
document.getElementById('refresh-products')?.addEventListener('click', loadProducts);
document.getElementById('view-button')?.addEventListener('click', handleViewProduct);

// Load products on page load
window.addEventListener('DOMContentLoaded', loadProducts);
