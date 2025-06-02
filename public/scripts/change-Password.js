document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('change-password-form');
    const message = document.getElementById('change-password-msg');

    function showToast(msg, isSuccess = true) {
        const toast = document.getElementById('toast');
        toast.textContent = msg;
        toast.style.backgroundColor = isSuccess ? '#4CAF50' : '#f44336'; // green/red
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }


    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;

            // 🔒 Simple password length check
            if (newPassword.length < 6) {
                showToast('New password must be at least 6 characters long', false);
                return;
            }

            try {
                const res = await fetch('/api/auth/change-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ currentPassword, newPassword })
                });

                const data = await res.json();
                showToast(data.message || data.error, res.ok);
            } catch (err) {
                showToast('Something went wrong!', false);
            }

            form.reset();
        });
    }
});
