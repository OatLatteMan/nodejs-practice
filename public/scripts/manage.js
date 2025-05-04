document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const messageDiv = document.getElementById('message');

    // Load and display products
    fetch('/api/products')
        .then(res => res.json())
        .then(products => {
            productList.innerHTML = '';
            products.forEach(product => {
                const li = document.createElement('li');
                li.innerHTML = `
            <strong>${product.name}</strong> - $${product.price}
            <button data-id="${product.id}">Delete</button>
          `;
                productList.appendChild(li);
            });

            // Add delete listeners
            document.querySelectorAll('button[data-id]').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.getAttribute('data-id');
                    const confirmDelete = confirm(`Delete product ${id}?`);
                    if (!confirmDelete) return;

                    const res = await fetch(`/api/products/${id}`, {
                        method: 'DELETE'
                    });

                    if (res.ok) {
                        messageDiv.textContent = 'Product deleted successfully!';
                        setTimeout(() => {
                            messageDiv.textContent = '';
                        }, 3000);
                        btn.parentElement.remove();
                    } else {
                        const error = await res.json();
                        alert(error.error || 'Failed to delete product');
                    }
                });
            });
        });
});
