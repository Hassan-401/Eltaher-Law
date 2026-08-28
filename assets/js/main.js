/* ==========================================================
   مكتب الطاهر للمحاماة — main.js  (مشترك بين كل الصفحات)
   ========================================================== */
(function () {
  'use strict';

  var WHATSAPP = '201003041170'; // رقم واتساب المكتب بصيغة دولية
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- شريط التنقل: التصغير عند النزول + شريط التقدم ---------- */
  var nav = $('#nav');
  var progress = $('#pageProgress');
  var toTop = $('#toTop');

  function onScroll() {
    var y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 40);
    if (toTop) toTop.classList.toggle('show', y > 600);

    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- قائمة الموبايل ---------- */
  var toggle = $('#navToggle');
  var links = $('#navLinks');
  var scrim = $('#navScrim');
  var scrimTimer;

  function isMenuOpen() {
    return !!links && links.classList.contains('open');
  }

  function setMenu(open) {
    if (!toggle || !links) return;

    links.classList.toggle('open', open);
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
    document.body.classList.toggle('menu-open', open);

    if (!scrim) return;
    clearTimeout(scrimTimer);

    if (open) {
      scrim.hidden = false;
      void scrim.offsetHeight; /* فرض إعادة تخطيط ليبدأ التلاشي من الصفر */
      scrim.classList.add('show');
    } else {
      scrim.classList.remove('show');
      scrimTimer = setTimeout(function () {
        if (!isMenuOpen()) scrim.hidden = true;
      }, 450);
    }
  }

  function closeMenu() { setMenu(false); }

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      setMenu(!isMenuOpen());
    });

    $$('a', links).forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  if (scrim) scrim.addEventListener('click', closeMenu);

  /* إغلاق القائمة تلقائيًا عند التوسّع لمقاس سطح المكتب
     (قفل التمرير نفسه محمي بالـ CSS، وهذا مجرد تنظيف للحالة) */
  if (window.matchMedia) {
    var mq = window.matchMedia('(max-width: 980px)');
    var onBreakpoint = function (e) {
      if (!e.matches && isMenuOpen()) closeMenu();
    };
    if (mq.addEventListener) mq.addEventListener('change', onBreakpoint);
    else if (mq.addListener) mq.addListener(onBreakpoint);
  }

  var menuResizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(menuResizeTimer);
    menuResizeTimer = setTimeout(function () {
      if (window.innerWidth > 980 && isMenuOpen()) closeMenu();
    }, 120);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMenu();
      $$('.nav__drop.open').forEach(function (d) {
        d.classList.remove('open');
        var b = $('.nav__drop-btn', d);
        if (b) b.setAttribute('aria-expanded', 'false');
      });
    }
  });

  /* ---------- قائمة مجالات العمل المنسدلة ---------- */
  $$('.nav__drop').forEach(function (drop) {
    var btn = $('.nav__drop-btn', drop);
    if (!btn) return;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = drop.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  document.addEventListener('click', function (e) {
    $$('.nav__drop.open').forEach(function (d) {
      if (!d.contains(e.target)) {
        d.classList.remove('open');
        var b = $('.nav__drop-btn', d);
        if (b) b.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* ---------- ظهور العناصر عند التمرير ---------- */
  var revealEls = $$('.reveal');

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- العدّادات ---------- */
  var counters = $$('[data-count]');

  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var duration = 1600;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en-US');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (counters.length) {
    if ('IntersectionObserver' in window) {
      var co = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              runCounter(entry.target);
              co.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      counters.forEach(function (el) { co.observe(el); });
    } else {
      counters.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
    }
  }

  /* ---------- تتبع القسم النشط (الصفحة الرئيسية فقط) ---------- */
  var sections = $$('section[id]');
  if (sections.length && links) {
    var hashLinks = $$('a[href^="#"]', links);
    if (hashLinks.length && 'IntersectionObserver' in window) {
      var so = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            hashLinks.forEach(function (a) {
              a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
            });
          });
        },
        { rootMargin: '-45% 0px -50% 0px' }
      );
      sections.forEach(function (s) { so.observe(s); });
    }
  }

  /* ---------- الأسئلة الشائعة ---------- */
  var faqItems = $$('.faq__item');

  faqItems.forEach(function (item) {
    var q = $('.faq__q', item);
    var box = $('.faq__a', item);
    if (!q || !box) return;

    q.addEventListener('click', function () {
      var open = item.classList.toggle('open');
      q.setAttribute('aria-expanded', String(open));
      box.style.height = open ? box.scrollHeight + 'px' : '0px';
    });
  });

  /* إعادة حساب ارتفاع الإجابات المفتوحة عند تغيّر عرض الشاشة */
  if (faqItems.length) {
    var faqTimer;
    window.addEventListener('resize', function () {
      clearTimeout(faqTimer);
      faqTimer = setTimeout(function () {
        $$('.faq__item.open').forEach(function (item) {
          var box = $('.faq__a', item);
          if (!box) return;
          box.style.height = 'auto';
          var h = box.scrollHeight;
          box.style.height = h + 'px';
        });
      }, 150);
    });
  }

  /* ---------- فلتر تصنيفات المقالات ---------- */
  var filter = $('#catFilter');
  var grid = $('#articleGrid');
  var empty = $('#emptyMsg');

  if (filter && grid) {
    filter.addEventListener('click', function (e) {
      var btn = e.target.closest('.chip');
      if (!btn) return;

      $$('.chip', filter).forEach(function (c) { c.classList.remove('is-on'); });
      btn.classList.add('is-on');

      var cat = btn.getAttribute('data-filter');
      var shown = 0;

      $$('.acard', grid).forEach(function (card) {
        var match = cat === 'all' || card.getAttribute('data-cat') === cat;
        card.style.display = match ? '' : 'none';
        if (match) shown++;
      });

      if (empty) empty.hidden = shown > 0;
    });
  }

  /* ---------- لافتة "مفتوح الآن" حسب توقيت القاهرة ---------- */
  var badge = $('#openBadge');
  if (badge) {
    var cairoHour;
    try {
      cairoHour = parseInt(
        new Intl.DateTimeFormat('en-US', {
          hour: 'numeric', hour12: false, timeZone: 'Africa/Cairo'
        }).format(new Date()),
        10
      );
    } catch (e) {
      cairoHour = new Date().getHours();
    }
    var isOpen = cairoHour >= 15 && cairoHour < 23;
    badge.textContent = isOpen ? 'المكتب مفتوح الآن' : 'المكتب مغلق حاليًا';
    badge.classList.add(isOpen ? 'is-open' : 'is-closed');
  }

  /* ---------- نموذج التواصل ← واتساب ---------- */
  var form = $('#contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      var type = form.type.value;
      var message = form.message.value.trim();

      var ok = true;
      [['name', name], ['phone', phone], ['message', message]].forEach(function (pair) {
        var field = form[pair[0]];
        var emptyVal = pair[1] === '';
        field.classList.toggle('invalid', emptyVal);
        if (emptyVal) ok = false;
      });

      if (!ok) {
        var first = form.querySelector('.invalid');
        if (first) first.focus();
        return;
      }

      var text =
        'السلام عليكم، أرغب في استشارة قانونية.\n\n' +
        'الاسم: ' + name + '\n' +
        'رقم الهاتف: ' + phone + '\n' +
        'نوع القضية: ' + type + '\n' +
        'التفاصيل: ' + message;

      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    });

    $$('input, textarea', form).forEach(function (el) {
      el.addEventListener('input', function () { el.classList.remove('invalid'); });
    });
  }

  /* ---------- سنة الفوتر ---------- */
  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
