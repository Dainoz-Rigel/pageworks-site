$(function () {

  // =========================
  // Cache main content (no flicker)
  // =========================
  const $mainContent = $('#main-content');
  if ($mainContent.length) {
    $mainContent.css('visibility', 'hidden');
  }

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
  // URL-based Success / Error Modals
  // =========================
  (function () {
    const params = new URLSearchParams(window.location.search);
    const result = params.get('result');
    if (!result) return;

    const modalMap = {
      pre_audit_success: '#preAuditModal',
      paid_audit_success: '#paymentModal',
      error: '#errorModal'
    };

    const selector = modalMap[result];
    if (selector && $(selector).length) {
      new bootstrap.Modal($(selector)[0]).show();
    }

    // Clean URL
    window.history.replaceState({}, document.title, window.location.pathname);
  })();

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
  // Partial Loader (jQuery-safe)
  // =========================
  function loadPartial(commentName, url, callback) {
    $('body, head').contents().each(function () {
      if (
        this.nodeType === 8 &&
        $.trim(this.nodeValue) === commentName
      ) {
        const commentNode = this;

        $.get(url)
          .done(function (html) {
            const $temp = $('<div>').html(html);
            $temp.contents().insertBefore(commentNode);
            $(commentNode).remove();

            if (typeof callback === 'function') {
              callback();
            }
          });
      }
    });
  }

  // =========================
  // Favicon + Theme Override
  // =========================
  loadPartial('favicon-partial', 'partials/favicon.html', function () {
    const favicon = document.getElementById('favicon-override');
    const appleTouch = document.getElementById('apple-touch-override');
    if (!favicon || !appleTouch) return;

    const root = document.documentElement;

    const faviconVariants = {
      16: {
        light: 'assets/img/favicons/Favicon_[Default]_-_16px.png',
        dark: 'assets/img/favicons/Favicon_[Inverted]_-_16px.png'
      },
      32: {
        light: 'assets/img/favicons/Favicon_[Default]_-_32px.png',
        dark: 'assets/img/favicons/Favicon_[Inverted]_-_32px.png'
      },
      48: {
        light: 'assets/img/favicons/Favicon_[Default]_-_48px.png',
        dark: 'assets/img/favicons/Favicon_[Inverted]_-_48px.png'
      },
      180: {
        light: 'assets/img/favicons/Favicon_[Default]_-_180px.png',
        dark: 'assets/img/favicons/Favicon_[Inverted]_-_180px.png'
      }
    };

    // Preload images
    $.each(faviconVariants, function (_, set) {
      $('<img>').attr('src', set.light);
      $('<img>').attr('src', set.dark);
    });

    function applyFaviconOverride() {
      const isDark = root.classList.contains('force-dark');
      favicon.href = isDark
        ? faviconVariants[32].dark
        : faviconVariants[32].light;
      appleTouch.href = isDark
        ? faviconVariants[180].dark
        : faviconVariants[180].light;
    }

    applyFaviconOverride();

    new MutationObserver(applyFaviconOverride)
      .observe(root, {
        attributes: true,
        attributeFilter: ['class']
      });
  });

  // =========================
  // Header Partial
  // =========================
  loadPartial('header-partial', 'partials/header.html', function () {
    const path = window.location.pathname.split('/').pop() || 'index.html';

    $('.nav-link').each(function () {
      if ($(this).attr('href') === path) {
        $(this).addClass('active');
      }
    });

    if ($mainContent.length) {
      $mainContent.css('visibility', 'visible');
    }
  });

  // =========================
  // Footer Partial
  // =========================
  loadPartial('footer-partial', 'partials/footer.html', function () {
    $('#year').text(new Date().getFullYear());
  });

});
