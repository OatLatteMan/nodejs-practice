document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const messageDiv = document.getElementById('message');

    document.getElementById('add-button').addEventListener('click', async () => {
        const name = document.getElementById('add-name').value.trim();
        const price = document.getElementById('add-price').value;

        if (!name || !price) {
            alert('Both name and price are required.');
            return;
        }

        const res = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, price })
        });

        if (res.ok) {
            document.getElementById('message').textContent = 'Product added successfully!';
            document.getElementById('add-name').value = '';
            document.getElementById('add-price').value = '';
            loadProducts(); // Refresh list
            setTimeout(() => {
                document.getElementById('message').textContent = '';
            }, 3000);
        } else {
            const error = await res.json();
            alert(error.error || 'Failed to add product');
        }
    });


    loadProducts();

    // Load and display products in the Manage section
    function loadProducts() {
        fetch('/api/products')
            .then(res => res.json())
            .then(products => {
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
            });
    }

    // Delete product by ID
    window.deleteProduct = function (id) {
        if (!confirm(`Delete product ${id}?`)) return;

        fetch(`/api/products/${id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(data => {
                messageDiv.textContent = data.message;
                setTimeout(() => (messageDiv.textContent = ''), 3000);
                loadProducts(); // Reload the list
            })
            .catch(() => alert('Failed to delete product'));
    };

    // View product by ID
    window.viewProduct = function (id) {
        fetch(`/api/products/${id}`)
            .then(res => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then(product => {
                alert(`Product Details:\n\nID: ${product.id}\nName: ${product.name}\nPrice: $${product.price}`);
            })
            .catch(() => alert('Product not found'));
    };

    // Handle update button click
    document.getElementById('update-button').addEventListener('click', async () => {
        const id = document.getElementById('update-id').value;
        const name = document.getElementById('update-name').value;
        const price = document.getElementById('update-price').value;

        if (!id || !name || !price) {
            alert('All fields are required.');
            return;
        }

        const res = await fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, price })
        });

        if (res.ok) {
            document.getElementById('message').textContent = 'Product updated successfully!';
            // Clear inputs
            document.getElementById('update-id').value = '';
            document.getElementById('update-name').value = '';
            document.getElementById('update-price').value = '';
            loadProducts(); // Reload product list
            setTimeout(() => {
                document.getElementById('message').textContent = '';
            }, 3000);
        } else {
            const error = await res.json();
            alert(error.error || 'Failed to update product');
        }
    });


    // Edit product - prefill the form
    window.editProduct = function (id, name, price) {
        document.getElementById('update-id').value = id;
        document.getElementById('update-name').value = name;
        document.getElementById('update-price').value = price;
        document.getElementById('update-section').scrollIntoView({ behavior: 'smooth' });
    };
});
