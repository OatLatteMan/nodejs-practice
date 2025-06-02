document.getElementById('logout-btn').addEventListener('click', async () => {
    try {
        const res = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include', // Send session cookie
        });

        if (res.ok) {
            window.location.href = '/auth';
        } else {
            alert('Logout failed!');
        }
    } catch (err) {
        console.error('Logout error:', err);
        alert('Logout error!');
    }
});
