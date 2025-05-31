window.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();

        if (data.loggedIn) {
            window.location.href = '/welcome.html';
        }
    } catch (err) {
        console.error('Session check failed', err);
    }
});


function showForm(type) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (type === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }

    clearMessage();
}

function clearMessage() {
    document.getElementById('message').innerText = '';
}

function showMessage(text, isError = false) {
    const msg = document.getElementById('message');
    msg.innerText = text;
    msg.style.color = isError ? 'red' : 'green';
}

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessage();

    const form = e.target;
    const rememberMe = document.getElementById('rememberMe').checked;

    const data = {
        username: form.username.value,
        password: form.password.value,
        rememberMe: rememberMe  // ✅ This must be included
    };

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        if (res.ok) {
            showMessage('Login successful!');
            window.location.href = "/welcome.html";
        } else {
            showMessage(result.error || 'Login failed.', true);
        }
    } catch (err) {
        console.error('Login error:', err); // ✅ Log the actual error
        showMessage('Login error.', true);
    }
});


document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessage();
    const form = e.target;
    const data = {
        username: form.username.value,
        password: form.password.value
    };

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        if (res.ok) {
            showMessage('Registration successful!');
            window.location.href = "/welcome.html";
        } else {
            showMessage(result.error || 'Registration failed.', true);
        }
    } catch (err) {
        showMessage('Registration error.', true);
    }
});
