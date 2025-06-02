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

document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/auth/me')
    .then(res => {
      if (!res.ok) {
        throw new Error('Not logged in');
      }
      return res.json();
    })
    .then(data => {
      const profileDiv = document.getElementById('profile');
      profileDiv.innerHTML = `<p><strong>Logged in as:</strong> ${data.username}</p>`;
    })
    .catch(err => {
      document.getElementById('profile').innerHTML = `<p>Unable to load profile.</p>`;
      console.error(err);
    });
});

