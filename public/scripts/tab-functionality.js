// Layout toggle logic

document.querySelectorAll('input[name="layoutMode"]').forEach(radio => {
    radio.addEventListener('change', () => {
        const layout = document.querySelector('input[name="layoutMode"]:checked').value;
        document.body.setAttribute('data-layout', layout);

        if (layout === 'accordion') {
            setupAccordionBehavior();
        } else {
            restoreTabBehavior();
        }
    });
});

function setupAccordionBehavior() {
    document.querySelectorAll('.tab-content').forEach(section => {
        section.classList.remove('active');
        section.classList.add('collapsed');

        const header = section.querySelector('h3');
        if (header && !header.dataset.accordionInit) {
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => {
                section.classList.toggle('collapsed');
            });
            header.dataset.accordionInit = 'true';
        }
    });

    document.querySelector('.tab-content')?.classList.remove('collapsed');
}

function restoreTabBehavior() {
    // Show the first tab again
    document.querySelector('.tab-button.active')?.click();
}


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

