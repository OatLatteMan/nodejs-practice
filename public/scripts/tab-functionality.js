document.addEventListener('DOMContentLoaded', () => {
    const layout = document.querySelector('input[name="layoutMode"]:checked')?.value || 'tabs';
    setLayoutMode(layout);

    // Show default tab (only meaningful for tabs)
    if (layout === 'tabs') {
        document.getElementById('tab-all-btn').click();
    }
});

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
    } else {
        restoreTabBehavior();
        document.getElementById('tab-all-btn').click();
    }
}

function setupAccordionBehavior() {
    document.querySelectorAll('.tab-content').forEach(section => {
        section.classList.add('collapsed');
        section.classList.remove('active');

        const header = section.querySelector('h3');
        if (header) {
            header.onclick = () => {
                section.classList.toggle('collapsed');
            };
        }
    });

    // Expand the first section by default
    const first = document.querySelector('.tab-content');
    if (first) {
        first.classList.remove('collapsed');
    }
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
