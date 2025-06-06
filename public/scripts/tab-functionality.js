// Tab functionality
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        const selectedTab = button.getAttribute('data-tab');

        // Update active button
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.toggle('active', btn === button);
        });

        // Fade out all tab contents
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        // Fade in selected tab
        const newTab = document.getElementById(`tab-${selectedTab}`);
        setTimeout(() => newTab.classList.add('active'), 10); // slight delay to trigger transition
    });
});