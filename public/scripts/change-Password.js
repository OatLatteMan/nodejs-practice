document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('change-password-form');
  const message = document.getElementById('change-password-msg');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const currentPassword = document.getElementById('current-password').value;
      const newPassword = document.getElementById('new-password').value;

      try {
        const res = await fetch('/api/auth/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currentPassword, newPassword })
        });

        const data = await res.json();
        message.textContent = data.message || data.error;
        message.style.color = res.ok ? 'green' : 'red';
      } catch (err) {
        message.textContent = 'Something went wrong!';
        message.style.color = 'red';
      }

      form.reset();
    });
  }
});
