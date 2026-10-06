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
      'about.location_label': '[ LOCATION ]',
      'about.location_val': 'EKATERINBURG, YEKT (UTC+5)',
      'about.roles_label': '[ ROLES ]',
      'about.roles_val': 'SKIN DESIGNER · REAL-TIME ARTIST · NEW ERA CREATIVE',

      'about.intro_html':
        'I specialize in <span class="badge-invert">Minecraft skins</span> and design — both graphic and <span class="badge-invert">realtime graphics</span>, generative art and interactive visual projects in <span class="badge-invert">TouchDesigner</span>. I craft skins with a focus on character, detail and atmosphere. I take private commissions and work with the <span class="badge-invert">New Era</span> studio team — there I handle design and creative direction, constantly collaborating and experimenting with form and style.',

      'about.community': 'community',
      'about.community_tag': '( COMMUNITY )',
      'about.specializing': '( SPECIALIZING IN )',
      'about.spec1': 'MINECRAFT SKINS & TEXTURING',
      'about.spec2': 'REAL-TIME GRAPHICS & TOUCHDESIGNER',
      'about.spec3': 'BRAND & GRAPHIC DESIGN',
      'about.community_html': '<span class="comm-token">Besides</span> <span class="comm-token">commercial</span> <span class="comm-token">projects,</span> <span class="comm-token">I</span> <span class="comm-token">run</span> <span class="comm-token">an</span> <span class="comm-token">open</span> <span class="comm-token">creative</span> <span class="comm-token">blog</span> <span class="comm-token">and</span> <span class="comm-token">share</span> <span class="comm-token">the</span> <span class="comm-token">process</span> <span class="comm-token">with</span> <span class="comm-token">the</span> <span class="comm-token">community.</span> <span class="comm-token">My</span> <span class="comm-token">content</span> <span class="comm-token">on</span> <span class="comm-token comm-badge">TouchDesigner</span> <span class="comm-token">and</span> <span class="comm-token">original</span> <span class="comm-token">design</span> <span class="comm-token">brings</span> <span class="comm-token">artists</span> <span class="comm-token">together</span> <span class="comm-token">on</span> <span class="comm-token comm-badge">Telegram,</span> <span class="comm-token comm-badge">TikTok,</span> <span class="comm-token">and</span> <span class="comm-token comm-badge">Discord,</span> <span class="comm-token">where</span> <span class="comm-token">I</span> <span class="comm-token">regularly</span> <span class="comm-token">post</span> <span class="comm-token">tutorials,</span> <span class="comm-token">behind-the-scenes</span> <span class="comm-token">of</span> <span class="comm-token">Minecraft</span> <span class="comm-token">skin</span> <span class="comm-token">work</span> <span class="comm-token">and</span> <span class="comm-token">first</span> <span class="comm-token">tests</span> <span class="comm-token">of</span> <span class="comm-token">generative</span> <span class="comm-token">visuals.</span>',

      'conn.title': 'Connections & Intersections',
      'conn.subtitle': 'I included this block because connections multiply efficiency and help close gaps in projects.',

      'role.me': 'me',
      'role.designer': 'designer',
      'role.streamer': 'streamer',
      'role.client': 'long-term client',
      'role.youtuber': 'youtuber / tiktoker',
      'role.artist': 'artist',
      'role.videographer': 'videographer',
      'role.studio': 'studio',
      'role.server': 'server',
      'role.engine': 'engine',
      'role.community': 'community',
    },

    ru: {
      'nav.home': 'ГЛАВНАЯ',
      'nav.works': 'РАБОТЫ',
      'nav.about': 'ОБО МНЕ',
      'nav.contacts': 'КОНТАКТЫ',

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
      'about.community_html': '<span class="comm-token">Помимо</span> <span class="comm-token">коммерческих</span> <span class="comm-token">проектов,</span> <span class="comm-token">я</span> <span class="comm-token">веду</span> <span class="comm-token">открытый</span> <span class="comm-token">блог</span> <span class="comm-token">и</span> <span class="comm-token">делюсь</span> <span class="comm-token">творческой</span> <span class="comm-token">кухней</span> <span class="comm-token">с</span> <span class="comm-token">сообществом.</span> <span class="comm-token">Мой</span> <span class="comm-token">контент</span> <span class="comm-token">по</span> <span class="comm-token comm-badge">TouchDesigner</span> <span class="comm-token">и</span> <span class="comm-token">авторскому</span> <span class="comm-token">дизайну</span> <span class="comm-token">объединяет</span> <span class="comm-token">артистов</span> <span class="comm-token">в</span> <span class="comm-token comm-badge">Telegram,</span> <span class="comm-token comm-badge">TikTok,</span> <span class="comm-token">и</span> <span class="comm-token comm-badge">Discord,</span> <span class="comm-token">где</span> <span class="comm-token">я</span> <span class="comm-token">регулярно</span> <span class="comm-token">публикую</span> <span class="comm-token">туториалы,</span> <span class="comm-token">бэкстейджи</span> <span class="comm-token">разработки</span> <span class="comm-token">майнкрафт</span> <span class="comm-token">скинов</span> <span class="comm-token">и</span> <span class="comm-token">первые</span> <span class="comm-token">тесты</span> <span class="comm-token">генеративных</span> <span class="comm-token">визуалов.</span>',

      'conn.title': 'Связи и пересечения',
      'conn.subtitle': 'Я включил этот блок, потому что знакомства множат эффективность и помогают закрывать дыры в проектах.',

      'role.me': 'я',
      'role.designer': 'дизайнер',
      'role.streamer': 'стример',
      'role.client': 'постоянный клиент',
      'role.youtuber': 'ютубер / тиктокер',
      'role.artist': 'художник',
      'role.videographer': 'видеограф',
      'role.studio': 'студия',
      'role.server': 'сервер',
      'role.engine': 'движок',
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
