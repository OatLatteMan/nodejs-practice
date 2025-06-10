// Ensure initial layout mode is respected
document.addEventListener('DOMContentLoaded', () => {
    const layout = document.querySelector('input[name="layoutMode"]:checked')?.value || 'tabs';
    document.body.setAttribute('data-layout', layout);

    if (layout === 'accordion') {
        setupAccordionBehavior();
    } else {
        restoreTabBehavior();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('tab-all-btn').click();
});

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
        if (header) {
            header.style.cursor = 'pointer';
            header.onclick = () => {
                section.classList.toggle('collapsed');
            };
        }
    });

    // Expand the first section by default
    const firstSection = document.querySelector('.tab-content');
    if (firstSection) {
        firstSection.classList.remove('collapsed');
        const arrow = firstSection.querySelector('.arrow');
        if (arrow) arrow.textContent = '▶';
    }
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

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const layout = body.dataset.layout;
    const tabButtons = document.querySelectorAll('.tabs button');
    const tabSections = document.querySelectorAll('.tab-content');

    // ✅ TABS MODE ONLY
    if (layout === 'tabs') {
        // Make sure only one .tab-content has "active"
        let anyActive = false;
        tabSections.forEach(section => {
            if (section.classList.contains('active')) {
                anyActive = true;
            } else {
                section.style.display = 'none'; // Hide others just in case
            }
        });

        // If none is active, activate the first one
        if (!anyActive && tabSections.length > 0) {
            tabSections[0].classList.add('active');
            tabSections[0].style.display = 'block';
        }

        // Handle tab button clicks
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const target = button.dataset.tab;

                tabSections.forEach(section => {
                    const isMatch = section.dataset.tab === target;
                    section.classList.toggle('active', isMatch);
                    section.style.display = isMatch ? 'block' : 'none';
                });
            });
        });
    }
});

