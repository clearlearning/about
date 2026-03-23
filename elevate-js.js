// elevate.js
// Core UI behavior for Elevate Mentorship pages (no SCORM)

// Namespace to avoid global collisions
window.Elevate = window.Elevate || {};

(function(Elevate) {
  // ---------- HAMBURGER MENU & SIDEBAR ----------
  Elevate.initHamburger = function() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sidebar = document.querySelector('.sidebar');

    if (!hamburgerBtn || !sidebar) return;

    // Create overlay once
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      document.body.appendChild(overlay);
    }

    function closeSidebar() {
      sidebar.classList.remove('mobile-open');
      hamburgerBtn.classList.remove('active');
      overlay.classList.remove('active');
    }

    hamburgerBtn.addEventListener('click', function() {
      const isOpen = sidebar.classList.toggle('mobile-open');
      hamburgerBtn.classList.toggle('active', isOpen);
      overlay.classList.toggle('active', isOpen);
    });

    overlay.addEventListener('click', closeSidebar);
  };

  // ---------- TABS ----------
  Elevate.initTabs = function() {
    const tabContainers = document.querySelectorAll('.tabs-container');
    if (!tabContainers.length) return;

    tabContainers.forEach(container => {
      const buttons = container.querySelectorAll('.tab-button');
      const panels = container.querySelectorAll('.tab-content');
      const placeholder = container.querySelector('.tab-placeholder');

      function activateTab(index) {
        buttons.forEach((btn, i) => {
          btn.classList.toggle('active', i === index);
        });
        panels.forEach((panel, i) => {
          panel.classList.toggle('active', i === index);
        });
        if (placeholder) {
          placeholder.classList.toggle('active', index === -1);
        }
      }

      buttons.forEach((btn, index) => {
        btn.addEventListener('click', function() {
          activateTab(index);
        });
      });

      // Default: first tab active, unless no panels
      if (panels.length) {
        activateTab(0);
      } else if (placeholder) {
        activateTab(-1);
      }
    });
  };

  // ---------- ACCORDIONS ----------
  Elevate.initAccordions = function() {
    const headers = document.querySelectorAll('.accordion-header');
    if (!headers.length) return;

    headers.forEach(header => {
      header.addEventListener('click', function() {
        const item = header.closest('.accordion-item');
        const contentId = header.getAttribute('data-target') || header.nextElementSibling?.id;
        const content = contentId ? document.getElementById(contentId) : header.nextElementSibling;
        const arrow = header.querySelector('.accordion-arrow');

        if (!content) return;

        const isOpen = content.classList.toggle('expanded');
        if (item) item.classList.toggle('open', isOpen);
        if (arrow) arrow.classList.toggle('open', isOpen);
      });
    });
  };

  // ---------- SCENARIO / DECISION BOXES ----------
  Elevate.initScenarios = function() {
    // Generic ".scenario-option" blocks that toggle feedback sections
    const options = document.querySelectorAll('.scenario-option, .option-button');
    if (!options.length) return;

    options.forEach(option => {
      option.addEventListener('click', function() {
        const group = option.closest('.scenario-box, .decision-point');
        if (!group) return;

        const allOptions = group.querySelectorAll('.scenario-option, .option-button');
        const feedbackBlocks = group.querySelectorAll('.scenario-feedback, .feedback-box');

        allOptions.forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');

        const targetId = option.getAttribute('data-feedback-id');
        if (!targetId) return;

        feedbackBlocks.forEach(block => {
          block.classList.remove('show');
        });

        const target = document.getElementById(targetId);
        if (target) {
          target.classList.add('show');
        }
      });
    });
  };

  // ---------- EISENHOWER MATRIX HOTSPOT ----------
  Elevate.initEisenhowerMatrix = function() {
    const matrix = document.getElementById('eisenhower-matrix');
    if (!matrix) return;

    const dots = [
      document.getElementById('matrix-dot-0'),
      document.getElementById('matrix-dot-1'),
      document.getElementById('matrix-dot-2'),
      document.getElementById('matrix-dot-3')
    ];
    const countSpan = document.getElementById('matrix-progress-count');
    const modals = [
      document.getElementById('matrix-modal-0'),
      document.getElementById('matrix-modal-1'),
      document.getElementById('matrix-modal-2'),
      document.getElementById('matrix-modal-3')
    ];

    const explored = new Set();

    function updateProgress() {
      if (!countSpan) return;
      countSpan.textContent = explored.size.toString();
      dots.forEach((dot, i) => {
        if (!dot) return;
        dot.style.backgroundColor = explored.has(i) ? '#64092c' : '#e0e0e0';
        dot.style.transform = explored.has(i) ? 'scale(1.1)' : 'scale(1.0)';
      });
    }

    function openModal(index) {
      if (!modals[index]) return;
      modals[index].style.display = 'block';
      explored.add(index);
      updateProgress();
    }

    function closeModal(index) {
      if (!modals[index]) return;
      modals[index].style.display = 'none';
    }

    // Rects are given IDs in the HTML (matrix-q0..q3)
    for (let i = 0; i < 4; i++) {
      const rect = document.getElementById('matrix-q' + i);
      if (rect) {
        rect.addEventListener('click', () => openModal(i));
      }
      const closeBtn = modals[i]?.querySelector('.hotspot-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal(i));
      }
    }

    // Initial state
    updateProgress();
  };

  // ---------- DOM READY ----------
  document.addEventListener('DOMContentLoaded', function() {
    Elevate.initHamburger();
    Elevate.initTabs();
    Elevate.initAccordions();
    Elevate.initScenarios();
    Elevate.initEisenhowerMatrix();
  });

})(window.Elevate);
