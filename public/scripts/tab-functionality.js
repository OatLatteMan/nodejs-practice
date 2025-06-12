document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const layout = document.querySelector('input[name="layoutMode"]:checked')?.value || 'tabs';

    setTheme(savedTheme);
    setLayoutMode(layout);

    // Show default tab (only meaningful for tabs)
    if (layout === 'tabs') {
        document.getElementById('tab-search-btn').click();
    }

    document.getElementById('theme-toggle-btn').addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark');
        const newTheme = isDark ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        updateThemeButtonText(newTheme);
    });
});

function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
    updateThemeButtonText(theme);
}

function updateThemeButtonText(theme) {
    const btn = document.getElementById('theme-toggle-btn');
    btn.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
}

document.querySelectorAll('input[name="layoutMode"]').forEach(radio => {
    radio.addEventListener('change', () => {
        const layout = radio.value;
        setLayoutMode(layout);
    });
});

function setLayoutMode(mode) {
    document.body.setAttribute('data-layout', mode);

    if (mode === 'accordion') {
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        setupAccordionBehavior();

        // ✅ Now expand the first accordion section
        const sections = document.querySelectorAll('.tab-section');
        if (sections.length > 0) {
            const firstSection = sections[0];
            const firstContent = firstSection.querySelector('.tab-content');

            // Make sure it's visible
            firstContent.style.display = 'block';

            // Trigger expansion
            requestAnimationFrame(() => {
                firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
            });

            firstSection.classList.remove('collapsed');
            firstSection.classList.add('active');
        }
    } else {
        restoreTabBehavior();
        document.getElementById('tab-search-btn').click();
    }
}


function setupAccordionBehavior() {
    const sections = document.querySelectorAll('.tab-section');

    sections.forEach(section => {
        const title = section.querySelector('.tab-title');
        const content = section.querySelector('.tab-content');

        // Reset everything first
        content.style.display = 'none';
        content.style.maxHeight = '';
        section.classList.add('collapsed');
        section.classList.remove('active');

        // Prevent duplicate listeners
        const newTitle = title.cloneNode(true);
        title.parentNode.replaceChild(newTitle, title);

        // Bind click to toggle section
        newTitle.addEventListener('click', () => {
            const isExpanded = section.classList.contains('active');

            // Collapse all first
            sections.forEach(s => {
                const c = s.querySelector('.tab-content');
                c.style.maxHeight = '';
                c.style.display = 'none';
                s.classList.remove('active');
                s.classList.add('collapsed');
            });

            if (!isExpanded) {
                content.style.display = 'block';
                requestAnimationFrame(() => {
                    content.style.maxHeight = content.scrollHeight + 'px';
                });
                section.classList.add('active');
                section.classList.remove('collapsed');
            }
        });
    });
}

function restoreTabBehavior() {
    // Reset collapsed state
    document.querySelectorAll('.tab-content').forEach(section => {
        section.classList.remove('collapsed');
    });
}

// Tab click functionality
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        const selectedId = button.getAttribute('aria-controls');

        document.querySelectorAll('.tab-button').forEach(btn =>
            btn.classList.toggle('active', btn === button)
        );

        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        const selectedTab = document.getElementById(selectedId);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
    });
});
