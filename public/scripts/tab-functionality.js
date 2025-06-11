document.addEventListener('DOMContentLoaded', () => {
    const layout = document.querySelector('input[name="layoutMode"]:checked')?.value || 'tabs';
    setLayoutMode(layout);

    // Show default tab (only meaningful for tabs)
    if (layout === 'tabs') {
        document.getElementById('tab-search-btn').click();
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
  const headers = document.querySelectorAll('.tab-header');

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const section = header.parentElement;
      const content = section.querySelector('.tab-content');
      const isExpanded = section.classList.contains('active');

      if (isExpanded) {
        collapseSection(section, content);
      } else {
        // Collapse other sections first
        document.querySelectorAll('.tab-section.active').forEach(otherSection => {
          if (otherSection !== section) {
            collapseSection(otherSection, otherSection.querySelector('.tab-content'));
          }
        });

        expandSection(section, content);
      }
    });
  });

  function expandSection(section, content) {
    content.style.display = 'block';
    const height = content.scrollHeight + 'px';

    content.style.maxHeight = '0px'; // reset to animate from 0
    requestAnimationFrame(() => {
      content.style.maxHeight = height;
    });

    section.classList.remove('collapsed');
    section.classList.add('active');

    // Remove inline max-height after transition
    content.addEventListener('transitionend', function handler() {
      content.style.maxHeight = 'none';
      content.removeEventListener('transitionend', handler);
    });
  }

  function collapseSection(section, content) {
    const height = content.scrollHeight + 'px';
    content.style.maxHeight = height;

    requestAnimationFrame(() => {
      content.style.maxHeight = '0px';
    });

    section.classList.add('collapsed');
    section.classList.remove('active');

    // Hide the content after the transition
    content.addEventListener('transitionend', function handler() {
      content.style.display = 'none';
      content.style.maxHeight = '';
      content.removeEventListener('transitionend', handler);
    });
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
