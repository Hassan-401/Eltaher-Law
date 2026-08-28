/* مولّد الموقع الثابت
   التشغيل من مجلد المشروع:  node build/build.js
   ينتج ملفات HTML عادية جاهزة للرفع على أي استضافة. */

const fs = require('fs');
const path = require('path');

const site = require('./data/site');
const icons = require('./data/icons');
const services = require('./data/services');
const articles = require('./data/articles');
const T = require('./templates');

const ROOT = path.join(__dirname, '..');
const { layout, pageHero, ctaBand, serviceCard, articleCard, formatDate, waLink } = T;

/* صياغة عربية سليمة لعدد الدقائق */
function minutesLabel(n) {
  if (n === 1) return 'دقيقة واحدة';
  if (n === 2) return 'دقيقتان';
  if (n <= 10) return n + ' دقائق';
  return n + ' دقيقة';
}

/* حساب زمن القراءة وترتيب المقالات من الأحدث */
articles.forEach((a) => {
  const words = a.body.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length;
  a.readTime = Math.max(2, Math.round(words / 150));
  a.readLabel = minutesLabel(a.readTime);
});
articles.sort((a, b) => new Date(b.date) - new Date(a.date));

const svcBySlug = Object.fromEntries(services.map((s) => [s.slug, s]));

function write(rel, html) {
  const out = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html, 'utf8');
  console.log('  ✓ ' + rel);
}

/* بطاقة تواصل جانبية تُستخدم في الصفحات الداخلية */
function asideContact(depth) {
  const b = T.B(depth);
  return `
<aside class="sticky-card reveal">
  <h3>استشارة سريعة</h3>
  <p>اشرح لنا موقفك ونوجّهك للخطوة الصحيحة. المكتب يستقبلكم ${site.hours}.</p>
  <a href="${waLink('السلام عليكم، أرغب في استشارة قانونية')}" target="_blank" rel="noopener" class="btn btn--gold btn--block">
    ${icons.whatsapp} تواصل عبر واتساب
  </a>
  <a href="tel:${site.phone1}" class="btn btn--line btn--block">${site.phone1}</a>
  <ul class="sticky-card__list">
    <li>${icons.clock}<span>${site.hours}</span></li>
    <li>${icons.pin}<span>${site.address}</span></li>
    <li>${icons.mail}<span dir="ltr">${site.email}</span></li>
  </ul>
  <a href="${b}contact.html" class="sticky-card__more">كل بيانات التواصل والخريطة ←</a>
</aside>`;
}

/* شريط تواصل مختصر */
function quickContact(depth) {
  const b = T.B(depth);
  return `
<section class="quick">
  <div class="container quick__grid">
    <a class="quick__item reveal" href="tel:${site.phone1}">
      <span class="quick__icon">${icons.phone}</span>
      <b>الهاتف وواتساب</b><span dir="ltr">${site.phone1}</span>
    </a>
    <a class="quick__item reveal" data-delay="1" href="tel:${site.phone2}">
      <span class="quick__icon">${icons.phone2}</span>
      <b>هاتف إضافي</b><span dir="ltr">${site.phone2}</span>
    </a>
    <a class="quick__item reveal" data-delay="2" href="${site.mapUrl}" target="_blank" rel="noopener">
      <span class="quick__icon">${icons.pin}</span>
      <b>العنوان</b><span>${site.addressStreet}، ${site.addressCity}</span>
    </a>
    <div class="quick__item quick__item--static reveal" data-delay="3">
      <span class="quick__icon">${icons.clock}</span>
      <b>مواعيد العمل</b><span>${site.hours}</span>
      <span class="badge-open" id="openBadge"></span>
    </div>
  </div>
</section>`;
}

const orgJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'LegalService',
  name: site.fullName,
  description: `مكتب محاماة واستشارات قانونية وعقارية بخبرة ${site.experience} عامًا في جميع التخصصات.`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.addressStreet,
    addressLocality: site.addressCity,
    addressRegion: site.addressRegion,
    addressCountry: 'EG'
  },
  telephone: ['+2' + site.phone1, '+2' + site.phone2],
  email: site.email,
  hasMap: site.mapUrl,
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday'],
      opens: '15:00',
      closes: '23:00'
    }
  ]
});

/* ================================================================== */
/* 1) الصفحة الرئيسية                                                  */
/* ================================================================== */
function buildHome() {
  const cards = services.map((s, i) => serviceCard(s, 0, i % 4)).join('');
  const latest = articles.slice(0, 3).map((a, i) => articleCard(a, 0, i)).join('');

  const content = `
<section class="hero" id="home">
  <div class="hero__bg">
    <img src="assets/img/hero.webp" alt="مكتب محاماة — ميزان العدالة ومطرقة القضاء" fetchpriority="high" />
    <div class="hero__veil"></div>
    <div class="hero__glow"></div>
  </div>

  <div class="container hero__inner">
    <div class="hero__content">
      <span class="pill reveal">
        <span class="pill__dot"></span>
        خبرة تمتد لأكثر من ${site.experience} عامًا في الساحة القانونية
      </span>

      <h1 class="hero__title reveal" data-delay="1">
        نُدافع عن حقك
        <span class="grad">بخبرة ومهنية</span>
        لا تقبل المساومة
      </h1>

      <p class="hero__text reveal" data-delay="2">
        ${site.fullName} — فريق قانوني متكامل يقدّم لك الاستشارة الدقيقة والترافع القوي
        أمام كافة درجات التقاضي، في جميع التخصصات.
      </p>

      <div class="hero__cta reveal" data-delay="3">
        <a href="${waLink('السلام عليكم، أرغب في استشارة قانونية')}" target="_blank" rel="noopener" class="btn btn--gold btn--lg">
          ${icons.whatsapp} استشارة عبر واتساب
        </a>
        <a href="services.html" class="btn btn--ghost btn--lg">تصفّح مجالات العمل</a>
      </div>

      <ul class="hero__facts reveal" data-delay="4">
        <li>${icons.clock} ${site.hours}</li>
        <li>${icons.pin} ${site.addressCity} — ${site.addressRegion}</li>
      </ul>
    </div>
  </div>

  <a href="#stats" class="hero__scroll" aria-label="انزل للأسفل"><span></span></a>
</section>

<section class="stats" id="stats">
  <div class="container">
    <div class="stats__grid">
      <div class="stat reveal">
        <span class="stat__num"><b data-count="${site.experience}">0</b>+</span>
        <span class="stat__label">عامًا من الخبرة العملية</span>
      </div>
      <div class="stat reveal" data-delay="1">
        <span class="stat__num"><b data-count="${services.length}">0</b></span>
        <span class="stat__label">تخصصًا قانونيًا نغطيه</span>
      </div>
      <div class="stat reveal" data-delay="2">
        <span class="stat__num"><b data-count="4">0</b></span>
        <span class="stat__label">درجات تقاضٍ نترافع أمامها</span>
      </div>
      <div class="stat reveal" data-delay="3">
        <span class="stat__num"><b data-count="100">0</b>%</span>
        <span class="stat__label">سرّية تامة للموكلين</span>
      </div>
    </div>
  </div>
</section>

<section class="section about" id="about">
  <div class="container about__grid">
    <div class="about__media reveal">
      <div class="about__frame">
        <img src="assets/img/about.webp" alt="${site.fullName} من الداخل" loading="lazy" />
      </div>
      <div class="about__badge"><b>${site.experience}</b><span>عامًا من الخبرة</span></div>
    </div>

    <div class="about__content">
      <span class="eyebrow reveal">عن المكتب</span>
      <h2 class="h2 reveal" data-delay="1">كيان قانوني <span class="grad">يوثَق به</span> منذ ${site.experience} عامًا</h2>
      <p class="lead reveal" data-delay="2">
        تأسّس ${site.fullName} ليكون سندًا قانونيًا لعملائه من الأفراد والشركات. نؤمن أن كل قضية
        لها تفاصيلها الخاصة، ولذلك نبني دفاعنا على دراسة مستفيضة للملف، وخطة عمل واضحة تُطلع عليها من اليوم الأول.
      </p>
      <ul class="checks reveal" data-delay="3">
        <li>دراسة مجانية مبدئية لملف القضية قبل التعاقد</li>
        <li>تقرير واضح عن فرص النجاح والمخاطر المحتملة</li>
        <li>سرّية مطلقة في التعامل مع بيانات ومستندات الموكل</li>
        <li>متابعة دورية وإخطارك بكل جلسة وكل مستجد</li>
      </ul>
      <div class="about__actions reveal" data-delay="4">
        <a href="about.html" class="btn btn--gold">تعرّف على المكتب</a>
        <a href="tel:${site.phone2}" class="btn btn--line">${site.phone2}</a>
      </div>
    </div>
  </div>
</section>

<section class="section services">
  <div class="container">
    <div class="section__head">
      <span class="eyebrow reveal">مجالات العمل</span>
      <h2 class="h2 reveal" data-delay="1">نغطي <span class="grad">جميع التخصصات</span> القانونية</h2>
      <p class="section__sub reveal" data-delay="2">
        لكل مجال صفحة مستقلة تشرح ما نقدّمه فيه ومتى تحتاج محاميًا والأسئلة الشائعة حوله.
      </p>
    </div>
    <div class="cards">${cards}</div>
  </div>
</section>

<section class="section why">
  <div class="container">
    <div class="section__head">
      <span class="eyebrow reveal">لماذا ${site.shortName}</span>
      <h2 class="h2 reveal" data-delay="1">أسباب تجعل <span class="grad">ملفك في أمان</span></h2>
    </div>
    <div class="why__grid">
      ${whyItems()}
    </div>
  </div>
</section>

<section class="section process">
  <div class="container">
    <div class="section__head">
      <span class="eyebrow reveal">آلية العمل</span>
      <h2 class="h2 reveal" data-delay="1">من أول اتصال <span class="grad">حتى تنفيذ الحكم</span></h2>
    </div>
    <ol class="steps">${stepItems()}</ol>
  </div>
</section>

<section class="section articles-teaser">
  <div class="container">
    <div class="section__head">
      <span class="eyebrow reveal">من المدونة</span>
      <h2 class="h2 reveal" data-delay="1">مقالات <span class="grad">تهمّك</span></h2>
      <p class="section__sub reveal" data-delay="2">شروحات قانونية مبسطة كتبناها من واقع أكثر ما يتكرر علينا من أسئلة.</p>
    </div>
    <div class="acards">${latest}</div>
    <div class="center-btn reveal">
      <a href="articles.html" class="btn btn--ghost btn--lg">كل المقالات</a>
    </div>
  </div>
</section>

${ctaBand(0)}
${quickContact(0)}
`;

  write(
    'index.html',
    layout({
      title: `${site.fullName} | ${site.addressCity}`,
      description: `${site.fullName} — خبرة ${site.experience} عامًا في جميع التخصصات: جنايات، جنح، أحوال شخصية، مدني، تعويضات، ضرائب، عقاري. ${site.addressCity} - ${site.addressRegion}. اتصل: ${site.phone1}`,
      depth: 0,
      active: 'home',
      content,
      jsonLd: orgJsonLd
    })
  );
}

const WHY = [
  ['خبرة ' + site.experience + ' عامًا', 'خبرة تراكمية أمام مختلف المحاكم والنيابات تجعلنا نتوقع مسار قضيتك قبل أن يبدأ.'],
  ['مكتب لكل التخصصات', 'لن تحتاج للبحث عن محامٍ آخر لكل نوع قضية — كل ملفاتك القانونية تُدار من مكان واحد.'],
  ['وضوح في الأتعاب', 'اتفاق مكتوب على الأتعاب والمصروفات من البداية، بلا مفاجآت في منتصف الطريق.'],
  ['تواصل مباشر', 'تتواصل مع المحامي المسؤول عن ملفك مباشرة عبر الهاتف أو واتساب، وتصلك تحديثات كل جلسة.'],
  ['سرّية تامة', 'كل ما يُقال داخل جدران المكتب أو يُرسل إلينا يظل سرًا مهنيًا لا يُفشى تحت أي ظرف.'],
  ['مواعيد مرنة', 'نستقبلك ' + site.hours + ' — مواعيد تناسب ارتباطات عملك.']
];

function whyItems() {
  return WHY.map(
    ([t, d], i) => `
    <div class="why__item reveal"${i ? ` data-delay="${i}"` : ''}>
      <span class="why__num">${String(i + 1).padStart(2, '0')}</span>
      <h3>${t}</h3>
      <p>${d}</p>
    </div>`
  ).join('');
}

const STEPS = [
  ['التواصل والاستماع', 'تتصل أو تراسلنا، ونستمع لتفاصيل موقفك كاملة دون استعجال، ونحدد موعدًا للقاء بالمكتب.'],
  ['دراسة الملف والمستندات', 'نفحص الأوراق ونحدد المركز القانوني، ونخبرك بصراحة بفرصك والمخاطر المحتملة.'],
  ['خطة الدفاع والاتفاق', 'نضع خطة واضحة بالخطوات والمواعيد والأتعاب، ونوقّع اتفاقًا مكتوبًا يحفظ حق الطرفين.'],
  ['الترافع والمتابعة', 'نحضر الجلسات ونقدّم المذكرات، ونوافيك بنتيجة كل جلسة أولًا بأول حتى صدور الحكم وتنفيذه.']
];

function stepItems() {
  return STEPS.map(
    ([t, d], i) => `
    <li class="step reveal"${i ? ` data-delay="${i}"` : ''}>
      <span class="step__dot">${i + 1}</span>
      <h3>${t}</h3>
      <p>${d}</p>
    </li>`
  ).join('');
}

/* ================================================================== */
/* 2) عن المكتب                                                        */
/* ================================================================== */
function buildAbout() {
  const content = `
${pageHero({
  eyebrow: 'عن المكتب',
  title: `${site.experience} عامًا في خدمة الحق`,
  sub: `${site.fullName} — كيان قانوني متكامل يقدّم الاستشارة والترافع في جميع التخصصات، من قلب ${site.addressCity}.`,
  crumbs: [{ label: 'عن المكتب' }],
  depth: 0
})}

<section class="section">
  <div class="container about__grid">
    <div class="about__media reveal">
      <div class="about__frame">
        <img src="assets/img/about.webp" alt="${site.fullName}" loading="lazy" />
      </div>
      <div class="about__badge"><b>${site.experience}</b><span>عامًا من الخبرة</span></div>
    </div>
    <div class="about__content prose">
      <span class="eyebrow reveal">من نحن</span>
      <h2 class="h2 reveal" data-delay="1">مكتب يبدأ من <span class="grad">تفاصيل ملفك</span></h2>
      <p class="lead reveal" data-delay="2">
        تأسّس المكتب ليكون سندًا قانونيًا للأفراد والشركات على السواء. وعلى مدى ${site.experience} عامًا،
        تعاملنا مع ملفات تتراوح بين الجنايات الكبرى والمنازعات العقارية والضريبية وقضايا الأسرة،
        وخرجنا منها بقناعة واحدة: لا توجد قضيتان متطابقتان، وأي حل جاهز هو حل خاطئ.
      </p>
      <p class="reveal" data-delay="3">
        لهذا نبدأ دائمًا من الأوراق. نقرأ الملف كاملًا، ونحدد المركز القانوني بدقة، ثم نضع خطة
        مكتوبة بالخطوات والمواعيد والاحتمالات. وإن كان الأنفع للموكل ألا يدخل في نزاع قضائي من
        الأساس، نقول له ذلك صراحة — فالنصيحة الصادقة أبقى من قضية تُكسب اليوم وتخسر الثقة غدًا.
      </p>
      <p class="reveal" data-delay="4">
        موقع المكتب في ${site.addressCity} جعل لنا خبرة خاصة بمنازعات وحدات وأراضي المدن الجديدة
        وقرارات التخصيص والأقساط، إلى جانب تخصصنا المعلن في الاستشارات العقارية عمومًا.
      </p>
    </div>
  </div>
</section>

<section class="section values">
  <div class="container">
    <div class="section__head">
      <span class="eyebrow reveal">مبادئ العمل</span>
      <h2 class="h2 reveal" data-delay="1">ما لا نساوم عليه</h2>
    </div>
    <div class="why__grid">
      <div class="why__item reveal">
        <span class="why__icon">${icons.shield}</span>
        <h3>الصراحة قبل التعاقد</h3>
        <p>نخبرك بفرصك الحقيقية ومخاطر قضيتك قبل أن تدفع جنيهًا واحدًا، حتى لو كان ذلك سببًا في ألا تتعاقد معنا.</p>
      </div>
      <div class="why__item reveal" data-delay="1">
        <span class="why__icon">${icons.doc}</span>
        <h3>كل شيء مكتوب</h3>
        <p>الأتعاب والمصروفات ونطاق العمل تُحدَّد في اتفاق مكتوب يحفظ حق الطرفين ويمنع أي خلاف لاحق.</p>
      </div>
      <div class="why__item reveal" data-delay="2">
        <span class="why__icon">${icons.chat}</span>
        <h3>لا تنقطع عنك</h3>
        <p>تصلك نتيجة كل جلسة أولًا بأول، وتتواصل مع المحامي المسؤول عن ملفك مباشرة لا عبر وسيط.</p>
      </div>
      <div class="why__item reveal" data-delay="3">
        <span class="why__icon">${icons.scales}</span>
        <h3>سر المهنة</h3>
        <p>كل ما تخبرنا به يظل سرًا مهنيًا لا يُفشى، سواء تعاقدنا معك أو لم نتعاقد.</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section__head">
      <span class="eyebrow reveal">آلية العمل</span>
      <h2 class="h2 reveal" data-delay="1">كيف نتعامل مع ملفك</h2>
    </div>
    <ol class="steps">${stepItems()}</ol>
  </div>
</section>

<section class="section why">
  <div class="container">
    <div class="section__head">
      <span class="eyebrow reveal">لماذا نحن</span>
      <h2 class="h2 reveal" data-delay="1">أسباب تجعل ملفك في أمان</h2>
    </div>
    <div class="why__grid">${whyItems()}</div>
  </div>
</section>

${ctaBand(0)}
${quickContact(0)}
`;

  write(
    'about.html',
    layout({
      title: `عن المكتب | ${site.fullName}`,
      description: `تعرّف على ${site.fullName} — ${site.experience} عامًا من الخبرة في جميع التخصصات القانونية، ومبادئ العمل وآليته داخل المكتب.`,
      depth: 0,
      active: 'about',
      content
    })
  );
}

/* ================================================================== */
/* 3) فهرس مجالات العمل                                                */
/* ================================================================== */
function buildServicesIndex() {
  const cards = services.map((s, i) => serviceCard(s, 0, i % 4)).join('');

  const content = `
${pageHero({
  eyebrow: 'مجالات العمل',
  title: 'جميع التخصصات القانونية',
  sub: `${services.length} مجالًا نغطيها داخل المكتب — لكل مجال صفحة تشرح ما نقدّمه فيه، ومتى تحتاج محاميًا، والمستندات المطلوبة، وأشهر الأسئلة.`,
  crumbs: [{ label: 'مجالات العمل' }],
  depth: 0
})}

<section class="section">
  <div class="container">
    <div class="cards">${cards}</div>
    <p class="services__note reveal">
      لم تجد تخصصك في القائمة؟ نحن نغطي <b>جميع التخصصات</b> —
      <a href="${waLink()}" target="_blank" rel="noopener">راسلنا على واتساب</a> وسنوجّهك.
    </p>
  </div>
</section>

${ctaBand(0)}
${quickContact(0)}
`;

  write(
    'services.html',
    layout({
      title: `مجالات العمل | ${site.fullName}`,
      description: `مجالات عمل ${site.fullName}: جنايات، جنح، أحوال شخصية، مدني، تعويضات، ضرائب، عقاري، شركات، عمالي، إداري، تنفيذ وتحكيم، واستشارات قانونية.`,
      depth: 0,
      active: 'services',
      content
    })
  );
}

/* ================================================================== */
/* 4) صفحة لكل مجال                                                    */
/* ================================================================== */
function buildServicePages() {
  services.forEach((s) => {
    const offer = s.offer
      .map(
        (o, i) => `
      <div class="feat reveal"${i ? ` data-delay="${i % 4}"` : ''}>
        <span class="feat__tick">${icons.check}</span>
        <div><b>${o.t}</b><p>${o.d}</p></div>
      </div>`
      )
      .join('');

    const when = s.when.map((w) => `<li>${w}</li>`).join('');
    const docs = s.docs.map((d) => `<li>${d}</li>`).join('');

    const faq = s.faq
      .map(
        (f, i) => `
      <div class="faq__item reveal"${i ? ` data-delay="${i}"` : ''}>
        <button type="button" class="faq__q" aria-expanded="false">
          <span>${f.q}</span>
          <span class="faq__ico" aria-hidden="true">${icons.chevronDown}</span>
        </button>
        <div class="faq__a"><p>${f.a}</p></div>
      </div>`
      )
      .join('');

    const related = s.related
      .map((slug) => svcBySlug[slug])
      .filter(Boolean)
      .map((r, i) => serviceCard(r, 1, i))
      .join('');

    const relatedArticles = articles
      .filter((a) => a.service === s.slug)
      .slice(0, 2)
      .map((a, i) => articleCard(a, 1, i))
      .join('');

    const jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: s.title,
      provider: { '@type': 'LegalService', name: site.fullName, telephone: '+2' + site.phone1 },
      areaServed: { '@type': 'City', name: site.addressCity },
      description: s.short,
      mainEntity: {
        '@type': 'FAQPage',
        mainEntity: s.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a }
        }))
      }
    });

    const content = `
${pageHero({
  eyebrow: 'مجالات العمل',
  title: s.title,
  sub: s.tagline,
  crumbs: [{ label: 'مجالات العمل', href: 'services.html' }, { label: s.navTitle }],
  depth: 1
})}

<section class="section">
  <div class="container split">
    <div class="split__main">
      <div class="prose reveal">
        <span class="svc__icon">${icons[s.icon]}</span>
        ${s.intro.map((p) => `<p class="lead">${p}</p>`).join('')}
      </div>

      <h2 class="h3 mt reveal">ما نقدّمه في هذا المجال</h2>
      <div class="feats">${offer}</div>

      <div class="two-col mt">
        <div class="panel reveal">
          <h3>${icons.clock} متى تحتاج محاميًا؟</h3>
          <ul class="checks">${when}</ul>
        </div>
        <div class="panel reveal" data-delay="1">
          <h3>${icons.doc} مستندات يُفضَّل إحضارها</h3>
          <ul class="dots">${docs}</ul>
        </div>
      </div>

      <h2 class="h3 mt reveal">أسئلة شائعة</h2>
      <div class="faq">${faq}</div>
    </div>

    <div class="split__side">
      ${asideContact(1)}
    </div>
  </div>
</section>

${
  relatedArticles
    ? `
<section class="section pt0">
  <div class="container">
    <div class="section__head section__head--start">
      <span class="eyebrow reveal">اقرأ أيضًا</span>
      <h2 class="h3 reveal" data-delay="1">مقالات في هذا المجال</h2>
    </div>
    <div class="acards acards--2">${relatedArticles}</div>
  </div>
</section>`
    : ''
}

<section class="section pt0">
  <div class="container">
    <div class="section__head section__head--start">
      <span class="eyebrow reveal">مجالات ذات صلة</span>
      <h2 class="h3 reveal" data-delay="1">قد تحتاج أيضًا</h2>
    </div>
    <div class="cards cards--3">${related}</div>
  </div>
</section>

${ctaBand(1, {
  title: `هل لديك قضية في ${s.navTitle}؟`,
  text: 'أرسل لنا تفاصيل موقفك وسنوضح لك خياراتك القانونية بصراحة قبل أي التزام.'
})}
`;

    write(
      `services/${s.slug}.html`,
      layout({
        title: `${s.title} | ${site.fullName}`,
        description: s.short,
        depth: 1,
        active: 'services',
        content,
        jsonLd
      })
    );
  });
}

/* ================================================================== */
/* 5) فهرس المقالات                                                    */
/* ================================================================== */
function buildArticlesIndex() {
  const cats = [...new Set(articles.map((a) => a.category))];
  const chips =
    `<button type="button" class="chip is-on" data-filter="all">الكل</button>` +
    cats.map((c) => `<button type="button" class="chip" data-filter="${c}">${c}</button>`).join('');

  const cards = articles.map((a, i) => articleCard(a, 0, i % 3)).join('');

  const content = `
${pageHero({
  eyebrow: 'المدونة القانونية',
  title: 'مقالات وشروحات قانونية',
  sub: 'كتبناها من واقع أكثر ما يتكرر علينا من أسئلة داخل المكتب — بلغة مبسطة بلا مصطلحات غامضة.',
  crumbs: [{ label: 'المقالات' }],
  depth: 0
})}

<section class="section">
  <div class="container">
    <div class="chips reveal" id="catFilter">${chips}</div>
    <div class="acards" id="articleGrid">${cards}</div>
    <p class="empty" id="emptyMsg" hidden>لا توجد مقالات في هذا التصنيف حاليًا.</p>
  </div>
</section>

${ctaBand(0, {
  title: 'سؤالك لم تجد إجابته هنا؟',
  text: 'المقالات تشرح القواعد العامة، أما ملفك فله تفاصيله. تواصل معنا لرأي يخص حالتك أنت.'
})}
`;

  write(
    'articles.html',
    layout({
      title: `المقالات القانونية | ${site.fullName}`,
      description: 'مقالات وشروحات قانونية مبسطة في الجنائي والأسرة والعقاري والضرائب والعمالي — من مكتب الطاهر للمحاماة.',
      depth: 0,
      active: 'articles',
      content
    })
  );
}

/* ================================================================== */
/* 6) صفحة لكل مقال                                                    */
/* ================================================================== */
function buildArticlePages() {
  articles.forEach((a) => {
    const rel = svcBySlug[a.service];
    const others = articles.filter((x) => x.slug !== a.slug).slice(0, 3).map((x, i) => articleCard(x, 1, i)).join('');

    const jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: a.title,
      description: a.excerpt,
      datePublished: a.date,
      author: { '@type': 'Organization', name: site.fullName },
      publisher: { '@type': 'Organization', name: site.fullName },
      articleSection: a.category
    });

    const content = `
${pageHero({
  eyebrow: a.category,
  title: a.title,
  crumbs: [{ label: 'المقالات', href: 'articles.html' }, { label: a.category }],
  depth: 1
})}

<section class="section pt-sm">
  <div class="container split">
    <div class="split__main">
      <div class="post__meta reveal">
        <span>${icons.calendar} ${formatDate(a.date)}</span>
        <span>${icons.clock} قراءة ${a.readLabel}</span>
        <span>${icons.tag} ${a.category}</span>
      </div>

      <article class="post prose reveal">
        <p class="lead">${a.excerpt}</p>
        ${a.body}
      </article>

      <div class="post__note reveal">
        <b>تنويه</b>
        <p>هذا المقال شرح عام للقواعد القانونية ولا يُعد استشارة في حالة بعينها. لكل ملف تفاصيله التي قد
        تغيّر الحكم كليًا، ولذلك ننصح بعرض أوراقك على محامٍ قبل اتخاذ أي إجراء.</p>
      </div>

      ${
        rel
          ? `<a class="post__svc reveal" href="../services/${rel.slug}.html">
              <span class="post__svc-ico">${icons[rel.icon]}</span>
              <span>
                <small>هذا المقال يخص مجال</small>
                <b>${rel.title}</b>
              </span>
              <span class="post__svc-arrow" aria-hidden="true">${icons.arrow}</span>
            </a>`
          : ''
      }
    </div>

    <div class="split__side">
      ${asideContact(1)}
    </div>
  </div>
</section>

<section class="section pt0">
  <div class="container">
    <div class="section__head section__head--start">
      <span class="eyebrow reveal">مقالات أخرى</span>
      <h2 class="h3 reveal" data-delay="1">اقرأ أيضًا</h2>
    </div>
    <div class="acards">${others}</div>
  </div>
</section>

${ctaBand(1)}
`;

    write(
      `articles/${a.slug}.html`,
      layout({
        title: `${a.title} | ${site.fullName}`,
        description: a.excerpt,
        depth: 1,
        active: 'articles',
        content,
        jsonLd
      })
    );
  });
}

/* ================================================================== */
/* 7) تواصل معنا                                                       */
/* ================================================================== */
function buildContact() {
  const opts = services.map((s) => `<option>${s.navTitle}</option>`).join('');

  const content = `
${pageHero({
  eyebrow: 'تواصل معنا',
  title: 'نحن في انتظارك',
  sub: `اختر الطريقة الأنسب لك — أو أرسل تفاصيل قضيتك في النموذج وسنعاود التواصل معك. المكتب يستقبلكم ${site.hours}.`,
  crumbs: [{ label: 'تواصل معنا' }],
  depth: 0
})}

<section class="section">
  <div class="container">
    <div class="contact__grid">
      <div class="contact__info">
        <a class="info reveal" href="tel:${site.phone1}">
          <span class="info__icon">${icons.phone}</span>
          <span class="info__body"><b>الهاتف وواتساب</b><span dir="ltr">${site.phone1}</span></span>
        </a>
        <a class="info reveal" data-delay="1" href="tel:${site.phone2}">
          <span class="info__icon">${icons.phone2}</span>
          <span class="info__body"><b>هاتف إضافي</b><span dir="ltr">${site.phone2}</span></span>
        </a>
        <a class="info reveal" data-delay="2" href="mailto:${site.email}">
          <span class="info__icon">${icons.mail}</span>
          <span class="info__body"><b>البريد الإلكتروني</b><span dir="ltr">${site.email}</span></span>
        </a>
        <a class="info reveal" data-delay="3" href="${site.mapUrl}" target="_blank" rel="noopener">
          <span class="info__icon">${icons.pin}</span>
          <span class="info__body"><b>العنوان</b><span>${site.address}</span></span>
        </a>
        <div class="info info--static reveal" data-delay="4">
          <span class="info__icon">${icons.clock}</span>
          <span class="info__body">
            <b>مواعيد العمل</b><span>${site.hours}</span>
            <span class="badge-open" id="openBadge"></span>
          </span>
        </div>
      </div>

      <form class="form reveal" data-delay="2" id="contactForm" novalidate>
        <h2 class="form__title">أرسل تفاصيل قضيتك</h2>
        <p class="form__hint">تُرسل الرسالة مباشرة إلى واتساب المكتب — سريعة ومضمونة الوصول.</p>

        <div class="field">
          <label for="fName">الاسم</label>
          <input type="text" id="fName" name="name" placeholder="اكتب اسمك بالكامل" required />
        </div>

        <div class="field-row">
          <div class="field">
            <label for="fPhone">رقم الهاتف</label>
            <input type="tel" id="fPhone" name="phone" placeholder="01xxxxxxxxx" dir="ltr" required />
          </div>
          <div class="field">
            <label for="fType">نوع القضية</label>
            <select id="fType" name="type">
              <option>استشارة قانونية عامة</option>
              ${opts}
              <option>أخرى</option>
            </select>
          </div>
        </div>

        <div class="field">
          <label for="fMsg">تفاصيل الموضوع</label>
          <textarea id="fMsg" name="message" rows="5" placeholder="اشرح لنا موقفك باختصار..." required></textarea>
        </div>

        <button type="submit" class="btn btn--gold btn--lg btn--block">
          إرسال عبر واتساب ${icons.whatsapp}
        </button>
        <a class="form__alt" href="mailto:${site.email}">أو راسلنا على البريد الإلكتروني</a>
      </form>
    </div>

    <div class="map reveal">
      <iframe title="موقع ${site.fullName} على الخريطة" src="${site.mapEmbed}"
        loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
      <a href="${site.mapUrl}" target="_blank" rel="noopener" class="btn btn--gold map__btn">
        ${icons.pin} افتح الموقع على خرائط جوجل
      </a>
    </div>
  </div>
</section>
`;

  write(
    'contact.html',
    layout({
      title: `تواصل معنا | ${site.fullName}`,
      description: `تواصل مع ${site.fullName}: ${site.phone1} — ${site.address} — ${site.hours}`,
      depth: 0,
      active: 'contact',
      content,
      jsonLd: orgJsonLd
    })
  );
}

/* ================================================================== */
/* 8) sitemap + robots                                                 */
/* ================================================================== */
function buildSitemap() {
  const pages = ['index.html', 'about.html', 'services.html', 'articles.html', 'contact.html']
    .concat(services.map((s) => `services/${s.slug}.html`))
    .concat(articles.map((a) => `articles/${a.slug}.html`));

  const today = new Date().toISOString().slice(0, 10);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>/${p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>`;
  write('sitemap.xml', xml);
  write('robots.txt', 'User-agent: *\nAllow: /\n\nSitemap: /sitemap.xml\n');
}

/* ================================================================== */
console.log('\nجارٍ بناء الموقع...\n');
buildHome();
buildAbout();
buildServicesIndex();
buildServicePages();
buildArticlesIndex();
buildArticlePages();
buildContact();
buildSitemap();
console.log(
  `\nتم ✔  ${5 + services.length + articles.length} صفحة (${services.length} مجال + ${articles.length} مقال)\n`
);
