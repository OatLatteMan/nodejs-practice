// Tab functionality
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        const selectedTab = button.getAttribute('aria-controls');

        // Update active button
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.toggle('active', btn === button);
        });

        // Fade out all tab contents
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        // Fade in selected tab
        const newTab = document.getElementById(selectedTab);
        setTimeout(() => newTab.classList.add('active'), 10); // slight delay to trigger transition
    });
});

document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('keydown', e => {
        const tabs = Array.from(document.querySelectorAll('.tab-button'));
        const index = tabs.indexOf(button);
        if (e.key === 'ArrowRight') {
            tabs[(index + 1) % tabs.length].focus();
        } else if (e.key === 'ArrowLeft') {
            tabs[(index - 1 + tabs.length) % tabs.length].focus();
        }
    });
});

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('tab-add-btn').click();
});

