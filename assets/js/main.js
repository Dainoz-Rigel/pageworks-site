$(document).ready(function () {

  // =========================
  // Portfolio markdown loading
  // =========================
  $('.portfolio-link').on('click', function (e) {
    e.preventDefault();
    const mdPath = $(this).data('md');
    const $content = $('#portfolio-content');

    $('.portfolio-link').removeClass('active');
    $(this).addClass('active');

    fetch(mdPath)
      .then(res => {
        if (!res.ok) throw new Error('Markdown file not found');
        return res.text();
      })
      .then(markdown => {
        const body = markdown.replace(/^---[\s\S]*?---\s*/, '');
        const htmlBody = marked.parse(body);
        $content.removeClass('empty').html(htmlBody);
      })
      .catch(() => {
        $content.html('<p class="muted-text">Unable to load this case study.</p>');
      });
  });

  // =========================
  // Show error modal
  // =========================
  function showError(message) {
    $('#errorModalMessage').text(message);
    const modal = new bootstrap.Modal(document.getElementById('errorModal'));
    modal.show();
  }

// =========================
// Pre-Audit Form Submission
// =========================
$('#pre-audit-form').on('submit', function (e) {
  e.preventDefault();
  const $form = $(this);
  const data = $form.serialize();

  $.post('https://spwbackend.iceiy.com/submit_pre_audit.php', data, function (response) {
    // Check for proper JSON structure
    if (response && typeof response.success !== 'undefined') {
      if (response.success) {
        const modal = new bootstrap.Modal(document.getElementById('preAuditModal'));
        modal.show();
        $form[0].reset();
      } else {
        showError(response.message || 'Submission failed');
      }
    } else {
      showError('Invalid server response.');
    }
  }, 'json').fail(function () {
    showError('Server error. Please try again later.');
  });
});

// =========================
// Paid Audit Form Submission
// =========================
$('#audit-form').on('submit', function (e) {
  e.preventDefault();
  const $form = $(this);
  const data = $form.serialize();

  $.post('https://spwbackend.iceiy.com/submit_paid_audit.php', data, function (response) {
    if (response && typeof response.success !== 'undefined') {
      if (response.success) {
        const modal = new bootstrap.Modal(document.getElementById('paymentModal'));
        modal.show();
        $form[0].reset();
      } else {
        showError(response.message || 'Submission failed');
      }
    } else {
      showError('Invalid server response.');
    }
  }, 'json').fail(function () {
    showError('Server error. Please try again later.');
  });
});

  // =========================
  // Audit View Toggle (URL-based)
  // =========================
  (function () {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    const $pre = $('#pre-audit-view');
    const $paid = $('#paid-audit-view');

    if (type === 'paid') {
      $pre.addClass('d-none');
      $paid.removeClass('d-none');
    } else {
      $paid.addClass('d-none');
      $pre.removeClass('d-none');
    }
  })();

  // =========================
  // Preload Header + Favicon + Theme Override (No Flicker)
  // =========================
  const mainContent = document.getElementById('main-content');
  if (mainContent) mainContent.style.visibility = 'hidden';

  function loadPartial(commentName, url, callback) {
    document.querySelectorAll('body, head').forEach(container => {
      Array.from(container.childNodes).forEach(node => {
        if (node.nodeType === 8 && node.nodeValue.trim() === commentName) {
          fetch(url)
            .then(res => res.text())
            .then(html => {
              const temp = document.createElement('div');
              temp.innerHTML = html;
              while (temp.firstChild) {
                node.parentNode.insertBefore(temp.firstChild, node);
              }
              node.parentNode.removeChild(node);
              if (typeof callback === 'function') callback();
            });
        }
      });
    });
  }

  // Favicon & Theme
  loadPartial('favicon-partial', 'partials/favicon.html', function () {
    const favicon = document.getElementById('favicon-override');
    const appleTouch = document.getElementById('apple-touch-override');
    if (!favicon || !appleTouch) return;

    const root = document.documentElement;
    const faviconVariants = {
      16: { light: 'assets/img/favicons/Favicon_[Default]_-_16px.png', dark: 'assets/img/favicons/Favicon_[Inverted]_-_16px.png' },
      32: { light: 'assets/img/favicons/Favicon_[Default]_-_32px.png', dark: 'assets/img/favicons/Favicon_[Inverted]_-_32px.png' },
      48: { light: 'assets/img/favicons/Favicon_[Default]_-_48px.png', dark: 'assets/img/favicons/Favicon_[Inverted]_-_48px.png' },
      180: { light: 'assets/img/favicons/Favicon_[Default]_-_180px.png', dark: 'assets/img/favicons/Favicon_[Inverted]_-_180px.png' }
    };

    Object.values(faviconVariants).forEach(f => {
      const imgLight = new Image(); imgLight.src = f.light;
      const imgDark = new Image(); imgDark.src = f.dark;
    });

    function applyFaviconOverride() {
      const isDark = root.classList.contains('force-dark');
      favicon.href = isDark ? faviconVariants[32].dark : faviconVariants[32].light;
      appleTouch.href = isDark ? faviconVariants[180].dark : faviconVariants[180].light;
    }

    applyFaviconOverride();
    new MutationObserver(applyFaviconOverride).observe(root, { attributes: true, attributeFilter: ['class'] });
  });

  // Header Partial
  loadPartial('header-partial', 'partials/header.html', function () {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('href') === path) link.classList.add('active');
    });
    if (mainContent) mainContent.style.visibility = 'visible';
  });

  // Footer Partial
  loadPartial('footer-partial', 'partials/footer.html', function () {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });

});
