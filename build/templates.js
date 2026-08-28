/* القوالب المشتركة — الهيدر والفوتر وهيكل الصفحة */

const site = require('./data/site');
const icons = require('./data/icons');
const services = require('./data/services');

/* المسار النسبي حسب عمق الصفحة (0 = الجذر، 1 = داخل مجلد) */
const B = (depth) => (depth === 0 ? '' : '../');

const waLink = (text) =>
  `https://wa.me/${site.whatsapp}${text ? '?text=' + encodeURIComponent(text) : ''}`;

/* ------------------------------------------------------------------ */
/* الهيدر                                                              */
/* ------------------------------------------------------------------ */
function header(depth, active) {
  const b = B(depth);
  const on = (k) => (active === k ? ' class="active"' : '');

  const megaItems = services
    .map(
      (s) => `
        <a href="${b}services/${s.slug}.html">
          <span class="mega__icon">${icons[s.icon]}</span>
          <span class="mega__txt"><b>${s.navTitle}</b><small>${s.tagline}</small></span>
        </a>`
    )
    .join('');

  return `
<div class="page-progress" id="pageProgress"></div>

<header class="nav" id="nav">
  <div class="container nav__inner">
    <a href="${b}index.html" class="brand" aria-label="${site.fullName}">
      <span class="brand__mark" aria-hidden="true">${icons.scales}</span>
      <span class="brand__text">
        <strong>${site.shortName}</strong>
        <small>للمحاماة والاستشارات القانونية</small>
      </span>
    </a>

    <nav class="nav__links" id="navLinks">
      <a href="${b}index.html"${on('home')}>الرئيسية</a>
      <a href="${b}about.html"${on('about')}>عن المكتب</a>

      <div class="nav__drop${active === 'services' ? ' is-active' : ''}">
        <button type="button" class="nav__drop-btn" aria-expanded="false">
          مجالات العمل <span class="nav__chev" aria-hidden="true">${icons.chevronDown}</span>
        </button>
        <div class="nav__mega">
          <div class="mega__grid">${megaItems}</div>
          <a class="mega__all" href="${b}services.html">
            عرض كل مجالات العمل <span aria-hidden="true">${icons.arrow}</span>
          </a>
        </div>
      </div>

      <a href="${b}articles.html"${on('articles')}>المقالات</a>
      <a href="${b}contact.html"${on('contact')}>تواصل معنا</a>
      <a href="tel:${site.phone1}" class="btn btn--gold nav__cta-mobile">اتصل الآن</a>
    </nav>

    <div class="nav__actions">
      <a href="tel:${site.phone1}" class="btn btn--gold btn--sm">
        ${icons.phone}<span>${site.phone1}</span>
      </a>
      <button class="nav__toggle" id="navToggle" aria-label="فتح القائمة" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>

<div class="nav__scrim" id="navScrim" hidden></div>`;
}

/* ------------------------------------------------------------------ */
/* الفوتر                                                              */
/* ------------------------------------------------------------------ */
function footer(depth) {
  const b = B(depth);
  const topServices = services
    .slice(0, 6)
    .map((s) => `<a href="${b}services/${s.slug}.html">${s.navTitle}</a>`)
    .join('');

  return `
<footer class="footer">
  <div class="container footer__grid">
    <div class="footer__brand">
      <a href="${b}index.html" class="brand">
        <span class="brand__mark" aria-hidden="true">${icons.scales}</span>
        <span class="brand__text">
          <strong>${site.shortName}</strong>
          <small>${site.tagline}</small>
        </span>
      </a>
      <p>خبرة ${site.experience} عامًا في خدمة الأفراد والشركات — نُدافع عن حقك بمهنية والتزام.</p>
      <div class="footer__social">
        <a href="${waLink()}" target="_blank" rel="noopener" aria-label="واتساب">${icons.whatsapp}</a>
        <a href="tel:${site.phone1}" aria-label="اتصال">${icons.phone}</a>
        <a href="mailto:${site.email}" aria-label="بريد إلكتروني">${icons.mail}</a>
        <a href="${site.mapUrl}" target="_blank" rel="noopener" aria-label="الموقع">${icons.pin}</a>
      </div>
    </div>

    <div class="footer__col">
      <h4>روابط الموقع</h4>
      <a href="${b}index.html">الرئيسية</a>
      <a href="${b}about.html">عن المكتب</a>
      <a href="${b}services.html">مجالات العمل</a>
      <a href="${b}articles.html">المقالات</a>
      <a href="${b}contact.html">تواصل معنا</a>
    </div>

    <div class="footer__col">
      <h4>مجالات العمل</h4>
      ${topServices}
      <a href="${b}services.html" class="footer__more">عرض الكل ←</a>
    </div>

    <div class="footer__col">
      <h4>بيانات التواصل</h4>
      <a href="tel:${site.phone1}" dir="ltr">${site.phone1}</a>
      <a href="tel:${site.phone2}" dir="ltr">${site.phone2}</a>
      <a href="mailto:${site.email}" dir="ltr">${site.email}</a>
      <span>${site.address}</span>
      <span>${site.hoursShort}</span>
    </div>
  </div>

  <div class="container footer__bottom">
    <p>© <span id="year">${site.year}</span> ${site.fullName} — جميع الحقوق محفوظة.</p>
    <p class="footer__disclaimer">المحتوى المعروض لأغراض التعريف بالمكتب ولا يُعد استشارة قانونية بذاته.</p>
  </div>
</footer>

<a href="${waLink('السلام عليكم')}" class="fab fab--wa" target="_blank" rel="noopener" aria-label="تواصل عبر واتساب">
  ${icons.whatsapp}
  <span class="fab__tip">استشارة واتساب</span>
</a>

<button class="fab fab--top" id="toTop" aria-label="العودة للأعلى">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
</button>`;
}

/* ------------------------------------------------------------------ */
/* هيكل الصفحة الكامل                                                  */
/* ------------------------------------------------------------------ */
function layout({ title, description, depth = 0, active = '', bodyClass = '', content, jsonLd = '', ogImage = 'hero.webp' }) {
  const b = B(depth);
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<meta name="description" content="${description}" />
<meta name="author" content="${site.fullName}" />
<meta name="theme-color" content="#0a0c0f" />

<meta property="og:type" content="website" />
<meta property="og:locale" content="ar_EG" />
<meta property="og:site_name" content="${site.fullName}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${b}assets/img/${ogImage}" />

<link rel="icon" href="${b}assets/img/favicon.svg" type="image/svg+xml" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Tajawal:wght@300;400;500;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="${b}assets/css/style.css" />
${jsonLd ? `<script type="application/ld+json">${jsonLd}</script>` : ''}
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
${header(depth, active)}
${content}
${footer(depth)}
<script src="${b}assets/js/main.js"></script>
</body>
</html>`;
}

/* ------------------------------------------------------------------ */
/* مكونات مشتركة                                                       */
/* ------------------------------------------------------------------ */

/* رأس الصفحات الداخلية */
function pageHero({ eyebrow, title, sub, crumbs = [], depth = 1 }) {
  const b = B(depth);
  const trail = [`<a href="${b}index.html">الرئيسية</a>`]
    .concat(
      crumbs.map((c) =>
        c.href ? `<a href="${b}${c.href}">${c.label}</a>` : `<span>${c.label}</span>`
      )
    )
    .join(`<i aria-hidden="true">${icons.chevron}</i>`);

  return `
<section class="phero">
  <div class="phero__bg"></div>
  <div class="container phero__inner">
    <nav class="crumbs" aria-label="مسار التنقل">${trail}</nav>
    ${eyebrow ? `<span class="eyebrow">${eyebrow}</span>` : ''}
    <h1 class="phero__title">${title}</h1>
    ${sub ? `<p class="phero__sub">${sub}</p>` : ''}
  </div>
</section>`;
}

/* شريط الدعوة للتواصل */
function ctaBand(depth, opts = {}) {
  const b = B(depth);
  const h = opts.title || 'هل تحتاج رأيًا قانونيًا اليوم؟';
  const p = opts.text || 'لا تترك قرارك للتخمين. تواصل معنا الآن واحصل على توجيه قانوني واضح لموقفك.';
  return `
<section class="cta">
  <div class="container cta__inner reveal">
    <div>
      <h2>${h}</h2>
      <p>${p}</p>
    </div>
    <div class="cta__btns">
      <a href="tel:${site.phone1}" class="btn btn--gold btn--lg">اتصل الآن — <bdi dir="ltr">${site.phone1}</bdi></a>
      <a href="${b}contact.html" class="btn btn--ghost btn--lg">احجز موعدًا</a>
    </div>
  </div>
</section>`;
}

/* بطاقة مجال عمل */
function serviceCard(s, depth, delay) {
  const b = B(depth);
  return `
<a class="card reveal" ${delay ? `data-delay="${delay}"` : ''} href="${b}services/${s.slug}.html">
  <span class="card__icon">${icons[s.icon]}</span>
  <h3>${s.navTitle}</h3>
  <p>${s.short}</p>
  <span class="card__link">اعرف المزيد <span aria-hidden="true">${icons.arrow}</span></span>
</a>`;
}

/* بطاقة مقال */
function articleCard(a, depth, delay) {
  const b = B(depth);
  return `
<a class="acard reveal" ${delay ? `data-delay="${delay}"` : ''} href="${b}articles/${a.slug}.html" data-cat="${a.category}">
  <span class="acard__cat">${a.category}</span>
  <h3>${a.title}</h3>
  <p>${a.excerpt}</p>
  <span class="acard__meta">
    <span>${icons.calendar} ${formatDate(a.date)}</span>
    <span>${icons.clock} ${a.readLabel}</span>
  </span>
</a>`;
}

const MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
function formatDate(iso) {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

module.exports = { layout, pageHero, ctaBand, serviceCard, articleCard, formatDate, B, waLink, site, icons, services };
