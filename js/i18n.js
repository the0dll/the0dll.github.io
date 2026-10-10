/* ==========================================================================
   Internationalization (i18n) Engine
   Supports English (en) and Russian (ru) with live language switching
   ========================================================================== */

(function () {
  'use strict';

  // --- Translation Dictionaries ---
  const STRINGS = {
    en: {
      'nav.home': 'HOME',
      'nav.works': 'WORKS',
      'nav.about': 'ABOUT',
      'nav.contacts': 'CONTACTS',
      'nav.menu': 'Menu',
      'nav.close': 'Close menu',

      'home.works': 'works',
      'home.contacts': 'contacts',
      'home.title': "the0dll — bespoke minecraft skins",
      'home.caption': 'portfolio',
      'home.media_caption': 'CUSTOM SKIN FOR THE0DLL — PORTFOLIO',

      'works.title': 'works',
      'works.page_title': "works — the0dll",
      'works.fishermen': 'fishermen order by Toolki',
      'about.runner': 'about',
      'about.work_html': '<span class="blur-token">My</span> <span class="blur-token">work</span> <span class="blur-token">includes</span> <span class="blur-token">creating</span> <span class="blur-token badge-token">custom skins</span> <span class="blur-token">for</span> <span class="blur-token badge-token">Minecraft,</span> <span class="blur-token">graphic</span> <span class="blur-token">design</span> <span class="blur-token">of</span> <span class="blur-token">any</span> <span class="blur-token">complexity,</span> <span class="blur-token">as</span> <span class="blur-token">well</span> <span class="blur-token">as</span> <span class="blur-token">designing</span> <span class="blur-token badge-token">interactive systems</span> <span class="blur-token">and</span> <span class="blur-token badge-token">generative content</span> <span class="blur-token">in</span> <span class="blur-token badge-token">TouchDesigner.</span> <span class="blur-token">I</span> <span class="blur-token">build</span> <span class="blur-token">visual</span> <span class="blur-token">solutions</span> <span class="blur-token">that</span> <span class="blur-token">not</span> <span class="blur-token">only</span> <span class="blur-token">catch</span> <span class="blur-token">the</span> <span class="blur-token">eye</span> <span class="blur-token">and</span> <span class="blur-token">emphasize</span> <span class="blur-token">individuality,</span> <span class="blur-token">but</span> <span class="blur-token">also</span> <span class="blur-token">stay</span> <span class="blur-token badge-token">technically precise,</span> <span class="blur-token">fully</span> <span class="blur-token">matching</span> <span class="blur-token">the</span> <span class="blur-token">concept</span> <span class="blur-token">and</span> <span class="blur-token">goals</span> <span class="blur-token">of</span> <span class="blur-token">each</span> <span class="blur-token">project.</span>',
      'works.stream': 'Works',
      'works.return': '← return home',
      'works.prev': 'Previous skin',
      'works.next': 'Next skin',
      'works.close': 'Close',
      'works.prev_image': 'Previous image',
      'works.next_image': 'Next image',

      'about.page_title': "about — the0dll",
      'about.file': '( FILE: ABOUT.TOE )',
      'about.status_label': '[ STATUS ]',
      'about.status_val': 'OPEN FOR COMMISSIONS',
      'about.price_label': '[ PRICE ]',
      'about.price_val': '$20 / SKIN',
      'about.location_label': '[ AVAILABILITY ]',
      'about.location_val': 'AVAILABLE WORLDWIDE',
      'about.roles_label': '[ ROLES ]',
      'about.roles_val': 'SKIN DESIGNER · REAL-TIME ARTIST · NEW ERA CREATIVE',

      'about.intro_html':
        'I love turning ideas into things you can actually feel — from <span class="badge-invert">custom skins for <span class="badge-invert">Minecraft</span></span> to graphic design and <span class="badge-invert">real-time visuals</span> made in <span class="badge-invert">TouchDesigner</span>. I’m drawn to strong characters, little details, and visuals with a mood of their own. I take commissions and create with the <span class="badge-invert">New Era</span> studio team, always looking for a way to make an idea feel unmistakably itself.',

      'about.community': 'community',
      'about.community_tag': '( COMMUNITY )',
      'about.specializing': '( SPECIALIZING IN )',
      'about.spec1': 'MINECRAFT SKINS & TEXTURING',
      'about.spec2': 'REAL-TIME GRAPHICS & TOUCHDESIGNER',
      'about.spec3': 'BRAND & GRAPHIC DESIGN',
      'about.community_html': '<span class="comm-token">A lot of</span> <span class="comm-token">what</span> <span class="comm-token">I do</span> <span class="comm-token">starts with</span> <span class="comm-token comm-badge">Minecraft</span> <span class="comm-token">skins</span> <span class="comm-token">—</span> <span class="comm-token">building</span> <span class="comm-token">characters,</span> <span class="comm-token">getting</span> <span class="comm-token">the</span> <span class="comm-token">details</span> <span class="comm-token">right,</span> <span class="comm-token">and</span> <span class="comm-token">making</span> <span class="comm-token">each</span> <span class="comm-token">one</span> <span class="comm-token">feel</span> <span class="comm-token">like</span> <span class="comm-token">someone</span> <span class="comm-token">real.</span> <span class="comm-token">I also share</span> <span class="comm-token">finished</span> <span class="comm-token">work,</span> <span class="comm-token">rough ideas,</span> <span class="comm-token">experiments,</span> <span class="comm-token">and</span> <span class="comm-token">bits of the process</span> <span class="comm-token">on</span> <span class="comm-token comm-badge">Discord</span> <span class="comm-token">and</span> <span class="comm-token comm-badge">X.</span> <span class="comm-token">For me,</span> <span class="comm-token">it’s</span> <span class="comm-token">all about</span> <span class="comm-token">giving</span> <span class="comm-token">an idea</span> <span class="comm-token">its own</span> <span class="comm-token">character</span> <span class="comm-token">and atmosphere.</span>',

      'conn.legend_me': 'Me',
      'conn.legend_people': 'People',
      'conn.legend_projects': 'Projects / Studios',
      'conn.legend_community': 'Community',
      'conn.legend_solid': 'Work / Direct Project',
      'conn.legend_dashed': 'Community / Acquaintance',
      'conn.cta_title': 'Want your project to be the next point on this map?',
      'conn.cta_text': 'Open to commissions and barter collaborations.',
      'conn.cta_btn': 'Message me on Discord',
      'conn.cta_href': 'https://discord.com/users/839165605630181477',
      'about.graph_btn': 'View connections & intersections',
      'conn.title': 'Connections & Intersections',
      'conn.reset_zoom': 'Reset zoom',
      'conn.subtitle': 'This map is a little look at the people and projects that have crossed my path. Good connections can lead to unexpected ideas, better work, and things none of us would make alone.',

      'role.me': 'me',
      'role.designer': 'designer',
      'role.streamer': 'streamer',
      'role.client': 'long-term client / streamer',
      'role.youtuber': 'youtuber / tiktoker',
      'role.artist': 'artist',
      'role.videographer': 'videographer',
      'role.studio': 'studio',
      'role.server': 'server',
      'role.engine': 'engine',
      'role.emotes': 'emotes',
      'role.community': 'community',
    },

    ru: {
      'nav.home': 'ГЛАВНАЯ',
      'nav.works': 'РАБОТЫ',
      'nav.about': 'ОБО МНЕ',
      'nav.contacts': 'КОНТАКТЫ',
      'nav.menu': 'Меню',
      'nav.close': 'Закрыть меню',

      'home.works': 'работы',
      'home.contacts': 'контакты',
      'home.title': "the0dll — авторские майнкрафт скины",
      'home.caption': 'портфолио',
      'home.media_caption': 'КАСТОМНЫЙ СКИН ДЛЯ THE0DLL — ПОРТФОЛИО',

      'works.title': 'работы',
      'works.page_title': "работы — the0dll",
      'works.fishermen': 'заказ «рыбаки» от Toolki',
      'about.runner': 'обо мне',
      'about.work_html': '<span class="blur-token">Моя</span> <span class="blur-token">работа</span> <span class="blur-token">включает</span> <span class="blur-token">создание</span> <span class="blur-token badge-token">кастомных скинов</span> <span class="blur-token">для</span> <span class="blur-token badge-token">Minecraft,</span> <span class="blur-token">разработку</span> <span class="blur-token badge-token">графического дизайна</span> <span class="blur-token">любой</span> <span class="blur-token">сложности,</span> <span class="blur-token">а</span> <span class="blur-token">также</span> <span class="blur-token">проектирование</span> <span class="blur-token badge-token">интерактивных систем</span> <span class="blur-token">и</span> <span class="blur-token badge-token">генеративного контента</span> <span class="blur-token">в</span> <span class="blur-token badge-token">TouchDesigner.</span> <span class="blur-token">Я</span> <span class="blur-token">создаю</span> <span class="blur-token">визуальные</span> <span class="blur-token">решения,</span> <span class="blur-token">которые</span> <span class="blur-token">не</span> <span class="blur-token">только</span> <span class="blur-token">цепляют</span> <span class="blur-token">взгляд</span> <span class="blur-token">и</span> <span class="blur-token">подчёркивают</span> <span class="blur-token">индивидуальность,</span> <span class="blur-token">но</span> <span class="blur-token">и</span> <span class="blur-token">остаются</span> <span class="blur-token badge-token">технически выверенными,</span> <span class="blur-token">полностью</span> <span class="blur-token">соответствуя</span> <span class="blur-token">концепции</span> <span class="blur-token">и</span> <span class="blur-token">задачам</span> <span class="blur-token">каждого</span> <span class="blur-token">проекта.</span>',
      'works.stream': 'Работы',
      'works.return': '← на главную',
      'works.prev': 'Предыдущий скин',
      'works.next': 'Следующий скин',
      'works.close': 'Закрыть',
      'works.prev_image': 'Предыдущее изображение',
      'works.next_image': 'Следующее изображение',

      'about.page_title': "обо мне — the0dll",
      'about.file': '( ФАЙЛ: ABOUT.TOE )',
      'about.status_label': '[ СТАТУС ]',
      'about.status_val': 'ОТКРЫТ ДЛЯ ЗАКАЗОВ',
      'about.price_label': '[ ЦЕНА ]',
      'about.price_val': 'ОТ 600 ₽ / СКИН',
      'about.location_label': '[ ЛОКАЦИЯ ]',
      'about.location_val': 'ЕКАТЕРИНБУРГ, YEKT (UTC+5)',
      'about.roles_label': '[ РОЛИ ]',
      'about.roles_val': 'СКИН-ДИЗАЙНЕР · REALTIME-ХУДОЖНИК · NEW ERA CREATIVE',

      'about.intro_html':
        'Я специализируюсь на <span class="badge-invert">майнкрафт скинах</span> и дизайне — как графическом, так и на <span class="badge-invert">графике в реальном времени</span>, генеративном искусстве и интерактивных визуальных проектах в <span class="badge-invert">TouchDesigner</span>. Создаю скины с акцентом на характер, детали и атмосферу. Работаю как на частные заказы, так и в команде студии <span class="badge-invert">New Era</span> — там занимаюсь дизайном и креативом, постоянно делаю коллаборации и экспериментирую с формой и стилем.',

      'about.community': 'сообщество',
      'about.community_tag': '( СООБЩЕСТВО )',
      'about.specializing': '( СПЕЦИАЛИЗИРУЮСЬ НА )',
      'about.spec1': 'MINECRAFT СКИНЫ И ТЕКСТУРИРОВАНИЕ',
      'about.spec2': 'ГРАФИКА В РЕАЛЬНОМ ВРЕМЕНИ И TOUCHDESIGNER',
      'about.spec3': 'БРЕНДИНГ И ГРАФИЧЕСКИЙ ДИЗАЙН',
      'about.community_html': '<span class="comm-token">Большая</span> <span class="comm-token">часть</span> <span class="comm-token">моей</span> <span class="comm-token">работы</span> <span class="comm-token">связана</span> <span class="comm-token">с</span> <span class="comm-token comm-badge">Minecraft</span> <span class="comm-token">скинмейкингом:</span> <span class="comm-token">от</span> <span class="comm-token">создания</span> <span class="comm-token">персонажей</span> <span class="comm-token">и</span> <span class="comm-token">текстурирования</span> <span class="comm-token">до</span> <span class="comm-token">частных</span> <span class="comm-token">заказов</span> <span class="comm-token">и</span> <span class="comm-token">работы</span> <span class="comm-token">со</span> <span class="comm-token">студиями.</span> <span class="comm-token">Я</span> <span class="comm-token">показываю</span> <span class="comm-token">готовые</span> <span class="comm-token">скины,</span> <span class="comm-token">ранние</span> <span class="comm-token">концепты,</span> <span class="comm-token">эксперименты</span> <span class="comm-token">и</span> <span class="comm-token">бэкстейдж</span> <span class="comm-token">процесса</span> <span class="comm-token">вместе</span> <span class="comm-token">с</span> <span class="comm-token">сообществом</span> <span class="comm-token">через</span> <span class="comm-token comm-badge">Telegram,</span> <span class="comm-token comm-badge">TikTok,</span> <span class="comm-token">и</span> <span class="comm-token comm-badge">Discord.</span> <span class="comm-token">В</span> <span class="comm-token">центре</span> <span class="comm-token">всегда</span> <span class="comm-token">остаются</span> <span class="comm-token">Minecraft,</span> <span class="comm-token">характер,</span> <span class="comm-token">детали</span> <span class="comm-token">и</span> <span class="comm-token">процесс</span> <span class="comm-token">превращения</span> <span class="comm-token">идеи</span> <span class="comm-token">в</span> <span class="comm-token">готового</span> <span class="comm-token">персонажа.</span>',

      'conn.legend_me': 'Я',
      'conn.legend_people': 'Люди',
      'conn.legend_projects': 'Проекты / Студии',
      'conn.legend_community': 'Комьюнити',
      'conn.legend_solid': 'Работа / Прямой проект',
      'conn.legend_dashed': 'Комьюнити / Знакомство',
      'conn.cta_title': 'Хотите, чтобы ваш проект стал следующей точкой на этой карте?',
      'conn.cta_text': 'Открыт к заказам и бартерным коллаборациям.',
      'conn.cta_btn': 'Открыть Telegram',
      'conn.cta_href': 'https://t.me/ThDaniil',
      'about.graph_btn': 'Посмотреть связи и пересечения',
      'conn.title': 'Связи и пересечения',
      'conn.reset_zoom': 'Сбросить масштаб',
      'conn.subtitle': 'Я включил этот блок, потому что знакомства множат эффективность и помогают закрывать дыры в проектах.',

      'role.me': 'я',
      'role.designer': 'дизайнер',
      'role.streamer': 'стример',
      'role.client': 'постоянный клиент / стример',
      'role.youtuber': 'ютубер / тиктокер',
      'role.artist': 'художник',
      'role.videographer': 'видеограф',
      'role.studio': 'студия',
      'role.server': 'сервер',
      'role.engine': 'движок',
      'role.emotes': 'эмоции',
      'role.community': 'сообщество',
    },
  };

  // --- Language State & Storage ---
  const STORAGE_KEY = 'the0dll_lang';

  function getLang() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'ru' || saved === 'en') return saved;
    } catch (_) {}
    return 'en';
  }

  // --- Translate Key Lookup ---
  function t(key, lang) {
    const L = lang || getLang();
    return (STRINGS[L] && STRINGS[L][key]) || (STRINGS.en[key]) || key;
  }

  // --- Apply Translations to DOM Elements ---
  function applyLanguage(lang) {
    if (lang !== 'en' && lang !== 'ru') lang = 'en';
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
    document.documentElement.lang = lang;

    document.querySelectorAll('.lang-btn[data-lang]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const val = t(key, lang);
      if (val != null) el.textContent = val;
    });

    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      const val = t(key, lang);
      if (val != null) el.innerHTML = val;
    });

    const titleKey = document.body.getAttribute('data-i18n-title');
    if (titleKey) document.title = t(titleKey, lang);

    document.querySelectorAll('[data-i18n-href]').forEach((el) => {
      const key = el.getAttribute('data-i18n-href');
      const val = t(key, lang);
      if (val) el.setAttribute('href', val);
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria');
      el.setAttribute('aria-label', t(key, lang));
    });

    window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  // --- Button Event Binding & Initialization ---
  function init() {
    document.querySelectorAll('.lang-btn[data-lang]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        applyLanguage(btn.dataset.lang);
      });
    });

    applyLanguage(getLang());
  }

  // --- Public API Export ---
  window.I18N = { t, getLang, applyLanguage, STRINGS };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
