const navigationEntry = performance.getEntriesByType('navigation')[0];
const isPageReload = navigationEntry?.type === 'reload';

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

function resetScrollToTop() {
    const previousBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    document.documentElement.style.scrollBehavior = previousBehavior;
}

if (isPageReload) {
    if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    resetScrollToTop();
    window.addEventListener('load', () => {
        requestAnimationFrame(resetScrollToTop);
    }, { once: true });
}

const body = document.body;
const heroVideo = document.querySelector('.hero-video');
const scrollFrog = document.querySelector('.scroll-frog');
const soundtrackAudio = document.querySelector('.soundtrack-audio');
const languagePicker = document.querySelector('.language-picker');
const languageButton = document.querySelector('.language-button');
const languageOptions = document.querySelectorAll('.language-option');
const musicButton = document.querySelector('.music-button');
const introVideo = document.querySelector('.intro-video');
const introVideoSource = document.querySelector('.intro-video source');
const introDots = document.querySelectorAll('.intro-dot');
const introPrev = document.querySelector('.intro-prev');
const introNext = document.querySelector('.intro-next');
const characterTiles = document.querySelectorAll('.character-tile');
const characterPrev = document.querySelector('.character-carousel-button.prev');
const characterNext = document.querySelector('.character-carousel-button.next');
const characterPreviewFace = document.querySelector('.character-preview .character-face');
const characterName = document.querySelector('.character-name');
const characterTag = document.querySelector('.character-tag');
let currentCharacterIndex = 0;
const translations = {
    ko: {
        htmlLang: 'ko',
        title: '썰매 게임',
        logoAlt: '썰매 게임',
        navLabel: '주요 메뉴',
        settingsLabel: '상단 설정',
        languageLabel: '언어 선택',
        musicOn: '음악 켜기',
        musicOff: '음악 끄기',
        loadingLabel: '게임 로딩 중',
        nav: ['게임 소개', '캐릭터', '미디어', '뉴스'],
        play: '플레이 하기',
        kicker: '같이 굴러야 더 재밌다',
        heroTitle: '친구들과 썰매 타고 놀자',
        heroCopy: '썰매 타고, 눈싸움하고, 부딪히며 노는<br>가장 유쾌한 겨울 놀이터',
        introVideoLabel: '게임 소개 영상',
        introDotsLabel: '소개 선택',
        prevIntro: '이전 소개',
        nextIntro: '다음 소개',
        introDotLabels: ['첫 번째 소개', '두 번째 소개', '세 번째 소개'],
        introLabel: '미끄러지는 겨울 놀이터',
        introTitle: '게임 소개',
        introCopy: '작은 개구리들이 썰매를 타고 눈길을 가릅니다. 점프하고, 부딪히고, 마지막 언덕까지 미끄러지며 친구들과 가장 유쾌한 겨울 레이스를 즐겨보세요.',
        characters: '캐릭터 소개',
        characterCopy: '좋아하는 친구를 골라 눈길을 내려가세요. 각 캐릭터는 같은 코스를 조금 다른 표정으로 미끄러집니다.',
        characterGridLabel: '캐릭터 선택',
        media: '미디어',
        news: '뉴스'
    },
    en: {
        htmlLang: 'en',
        title: 'Sledding Game',
        logoAlt: 'Sledding Game',
        navLabel: 'Main menu',
        settingsLabel: 'Header settings',
        languageLabel: 'Choose language',
        musicOn: 'Turn music on',
        musicOff: 'Turn music off',
        loadingLabel: 'Game loading',
        nav: ['About', 'Characters', 'Media', 'News'],
        play: 'Play Now',
        kicker: 'Rolling together is better',
        heroTitle: 'Go Sledding With Friends',
        heroCopy: 'Sled, throw snowballs, bump around,<br>and enjoy the happiest winter playground',
        introVideoLabel: 'About video',
        introDotsLabel: 'Choose intro',
        prevIntro: 'Previous intro',
        nextIntro: 'Next intro',
        introDotLabels: ['First intro', 'Second intro', 'Third intro'],
        introLabel: 'A Slippery Winter Playground',
        introTitle: 'About',
        introCopy: 'Tiny frogs carve through snowy tracks on bright blue sleds. Jump, bump, slide, and race with friends all the way down the happiest winter hill.',
        characters: 'Meet the Characters',
        characterCopy: 'Pick your favorite buddy and slide down the snow. Every character brings a different mood to the same wild course.',
        characterGridLabel: 'Choose character',
        media: 'Media',
        news: 'News'
    },
    ja: {
        htmlLang: 'ja',
        title: 'そりすべりゲーム',
        logoAlt: 'そりすべりゲーム',
        navLabel: 'メインメニュー',
        settingsLabel: 'ヘッダー設定',
        languageLabel: '言語を選択',
        musicOn: '音楽をオン',
        musicOff: '音楽をオフ',
        loadingLabel: 'ゲームを読み込み中',
        nav: ['ゲーム紹介', 'キャラクター', 'メディア', 'ニュース'],
        play: 'プレイする',
        kicker: '一緒に転がるほど楽しい',
        heroTitle: '友だちとそりで遊ぼう',
        heroCopy: 'そりに乗って、雪玉を投げて、ぶつかって遊ぶ<br>最高に楽しい冬の遊び場',
        introVideoLabel: 'ゲーム紹介映像',
        introDotsLabel: '紹介を選択',
        prevIntro: '前の紹介',
        nextIntro: '次の紹介',
        introDotLabels: ['1つ目の紹介', '2つ目の紹介', '3つ目の紹介'],
        introLabel: 'すべって遊ぶ冬の遊び場',
        introTitle: 'ゲーム紹介',
        introCopy: '小さなカエルたちが青いそりで雪道を滑ります。ジャンプして、ぶつかって、友だちと一緒に楽しい冬の坂を最後まで走り抜けましょう。',
        characters: 'キャラクター紹介',
        characterCopy: '好きな仲間を選んで雪道を滑りましょう。どのキャラクターも同じコースを少し違う表情で走ります。',
        characterGridLabel: 'キャラクターを選択',
        media: 'メディア',
        news: 'ニュース'
    }
};
const introVideos = [
    '20260516-0520-43.7799556.mp4',
    'download.mp4',
    '제목 없는 디자인.mp4'
];
const frogRuns = [
    { section: document.querySelector('.video-section'), fromRight: true, startFactor: 0.72, endFactor: 0.5 },
    { section: document.querySelector('.intro-section'), fromRight: false, lowRoad: true },
    { section: document.querySelector('.character-section'), fromRight: true },
    { section: document.querySelector('.media-section'), fromRight: false }
];

window.setTimeout(() => {
    body.classList.add('is-ready');
}, 2400);

heroVideo.addEventListener('canplay', () => {
    body.classList.add('has-video');
});

soundtrackAudio.volume = 0.42;
musicButton.setAttribute('aria-pressed', 'false');
musicButton.setAttribute('aria-label', '음악 켜기');

function setLanguage(lang) {
    const copy = translations[lang] || translations.ko;
    const navLinks = document.querySelectorAll('.nav a');
    const ctaButtons = document.querySelectorAll('.play-link, .cta');
    const characterTitle = document.querySelector('.character-section .section-title');
    const characterCopy = document.querySelector('.character-copy');
    const characterGrid = document.querySelector('.character-grid');
    const mediaTitle = document.querySelector('.media-section .section-title');
    const newsTitle = document.querySelector('.news-section .section-title');
    const introTitle = document.querySelector('.intro-section .section-title');
    const introLabel = document.querySelector('.intro-label');
    const introCopy = document.querySelector('.intro-copy');
    const introShowcase = document.querySelector('.intro-showcase');
    const introDotsWrap = document.querySelector('.intro-dots');

    document.documentElement.lang = copy.htmlLang;
    document.title = copy.title;
    document.querySelector('.loader-screen').setAttribute('aria-label', copy.loadingLabel);
    document.querySelector('.header-logo').setAttribute('alt', copy.logoAlt);
    document.querySelector('.nav').setAttribute('aria-label', copy.navLabel);
    document.querySelector('.header-actions').setAttribute('aria-label', copy.settingsLabel);
    languageButton.setAttribute('aria-label', copy.languageLabel);
    languageOptions.forEach((option) => {
        const selected = option.dataset.lang === lang;
        option.classList.toggle('is-selected', selected);
        option.setAttribute('aria-checked', String(selected));
    });

    navLinks.forEach((link, index) => {
        link.textContent = copy.nav[index];
    });

    ctaButtons.forEach((button) => {
        button.textContent = copy.play;
    });

    document.querySelector('.hero-kicker').textContent = copy.kicker;
    document.querySelector('.hero-title').textContent = copy.heroTitle;
    document.querySelector('.hero-copy').innerHTML = copy.heroCopy;
    introShowcase.setAttribute('aria-label', copy.introVideoLabel);
    introDotsWrap.setAttribute('aria-label', copy.introDotsLabel);
    introPrev.setAttribute('aria-label', copy.prevIntro);
    introNext.setAttribute('aria-label', copy.nextIntro);
    introDots.forEach((dot, index) => {
        dot.setAttribute('aria-label', copy.introDotLabels[index]);
    });
    if (introLabel) {
        introLabel.textContent = copy.introLabel;
    }
    if (introTitle) {
        introTitle.textContent = copy.introTitle;
    }
    if (introCopy) {
        introCopy.textContent = copy.introCopy;
    }
    characterTitle.textContent = copy.characters;
    characterCopy.textContent = copy.characterCopy;
    characterGrid.setAttribute('aria-label', copy.characterGridLabel);
    mediaTitle.textContent = copy.media;
    newsTitle.textContent = copy.news;
    musicButton.setAttribute('aria-label', soundtrackAudio.paused ? copy.musicOn : copy.musicOff);
}

function updateCharacterWindow(index) {
    const visibleCount = window.matchMedia('(max-width: 760px)').matches ? 3 : 5;
    const maxStart = Math.max(characterTiles.length - visibleCount, 0);
    const start = clamp(index - Math.floor(visibleCount / 2), 0, maxStart);
    const end = start + visibleCount;

    characterTiles.forEach((tile, tileIndex) => {
        tile.classList.toggle('is-window-hidden', tileIndex < start || tileIndex >= end);
    });
}

function selectCharacter(index) {
    currentCharacterIndex = (index + characterTiles.length) % characterTiles.length;
    const tile = characterTiles[currentCharacterIndex];

    characterTiles.forEach((item) => item.classList.remove('is-selected'));
    tile.classList.add('is-selected');
    characterPreviewFace.className = `character-face ${tile.dataset.face}`;
    characterPreviewFace.innerHTML = '<span></span>';
    characterPreviewFace.style.removeProperty('--large-character');
    characterPreviewFace.style.removeProperty('--large-character-size');
    characterPreviewFace.style.removeProperty('--large-character-position');
    const tileFace = tile.querySelector('.character-face');
    const tileFaceStyle = getComputedStyle(tileFace);
    characterPreviewFace.style.setProperty('--profile-x', tileFaceStyle.getPropertyValue('--profile-x'));
    characterPreviewFace.style.setProperty('--profile-y', tileFaceStyle.getPropertyValue('--profile-y'));
    characterPreviewFace.style.setProperty('--profile-shift-x', tileFaceStyle.getPropertyValue('--profile-shift-x'));
    characterPreviewFace.style.setProperty('--profile-shift-y', tileFaceStyle.getPropertyValue('--profile-shift-y'));
    if (tile.dataset.large) {
        characterPreviewFace.classList.add('has-large');
        characterPreviewFace.style.setProperty('--large-character', `url("${tile.dataset.large}")`);
        if (tile.dataset.largeSize) {
            characterPreviewFace.style.setProperty('--large-character-size', tile.dataset.largeSize);
        }
        if (tile.dataset.largePosition) {
            characterPreviewFace.style.setProperty('--large-character-position', tile.dataset.largePosition);
        }
    }
    characterName.textContent = tile.dataset.name;
    characterTag.textContent = tile.dataset.tag;
    updateCharacterWindow(currentCharacterIndex);
}

characterTiles.forEach((tile, index) => {
    tile.addEventListener('click', () => {
        selectCharacter(index);
    });
});

characterPrev.addEventListener('click', () => {
    selectCharacter(currentCharacterIndex - 1);
});

characterNext.addEventListener('click', () => {
    selectCharacter(currentCharacterIndex + 1);
});

selectCharacter(currentCharacterIndex);

function setIntroDot(index) {
    introDots.forEach((item, itemIndex) => {
        const selected = itemIndex === index;
        item.classList.toggle('is-active', selected);
        item.setAttribute('aria-pressed', String(selected));
    });

    if (introVideos[index] && introVideoSource.getAttribute('src') !== introVideos[index]) {
        introVideoSource.setAttribute('src', introVideos[index]);
        introVideo.load();
        introVideo.play().catch(() => {});
    }
}

introDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        setIntroDot(index);
    });
});

introPrev.addEventListener('click', () => {
    const activeIndex = Array.from(introDots).findIndex((dot) => dot.classList.contains('is-active'));
    setIntroDot((activeIndex - 1 + introDots.length) % introDots.length);
});

introNext.addEventListener('click', () => {
    const activeIndex = Array.from(introDots).findIndex((dot) => dot.classList.contains('is-active'));
    setIntroDot((activeIndex + 1) % introDots.length);
});

introDots.forEach((dot, index) => {
    dot.addEventListener('mouseenter', () => {
        setIntroDot(index);
    });
});

languageButton.addEventListener('click', () => {
    const isOpen = languagePicker.classList.toggle('is-open');
    languageButton.setAttribute('aria-expanded', String(isOpen));
});

languageOptions.forEach((option) => {
    option.addEventListener('click', () => {
        setLanguage(option.dataset.lang);
        languagePicker.classList.remove('is-open');
        languageButton.setAttribute('aria-expanded', 'false');
        languageButton.focus();
    });
});

document.addEventListener('click', (event) => {
    if (!languagePicker.contains(event.target)) {
        languagePicker.classList.remove('is-open');
        languageButton.setAttribute('aria-expanded', 'false');
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        languagePicker.classList.remove('is-open');
        languageButton.setAttribute('aria-expanded', 'false');
        languageButton.focus();
    }
});

musicButton.addEventListener('click', async () => {
    if (soundtrackAudio.paused) {
        try {
            await soundtrackAudio.play();
            musicButton.classList.add('is-active');
            musicButton.setAttribute('aria-pressed', 'true');
            musicButton.setAttribute('aria-label', translations[document.documentElement.lang]?.musicOff || translations.ko.musicOff);
        } catch (error) {
            musicButton.classList.remove('is-active');
            musicButton.setAttribute('aria-pressed', 'false');
        }
        return;
    }

    soundtrackAudio.pause();
    musicButton.classList.remove('is-active');
    musicButton.setAttribute('aria-pressed', 'false');
    musicButton.setAttribute('aria-label', translations[document.documentElement.lang]?.musicOn || translations.ko.musicOn);
});

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function smoothstep(value) {
    return value * value * (3 - 2 * value);
}

function gentleStep(value) {
    return smoothstep(smoothstep(value));
}

function updateScrollFrog() {
    let activeRun = null;
    let progress = 0;

    frogRuns.some((run) => {
        const trackY = run.section.offsetTop + run.section.offsetHeight;
        const start = trackY - window.innerHeight * (run.startFactor ?? 1.45);
        const end = trackY + window.innerHeight * (run.endFactor ?? 0.22);
        const runProgress = (window.scrollY - start) / (end - start);

        if (runProgress >= 0 && runProgress <= 1) {
            activeRun = run;
            progress = clamp(runProgress, 0, 1);
            return true;
        }

        return false;
    });

    if (!activeRun) {
        scrollFrog.style.setProperty('--frog-opacity', 0);
        return;
    }

    const eased = gentleStep(progress);
    const fadeIn = clamp(progress / 0.24, 0, 1);
    const fadeOut = clamp((1 - progress) / 0.28, 0, 1);
    const visible = fadeIn * fadeOut;
    const wave = Math.sin(eased * Math.PI);
    const xStart = activeRun.fromRight ? 104 : -4;
    const xEnd = activeRun.fromRight ? -4 : 104;
    const x = xStart + (xEnd - xStart) * eased;
    const y = activeRun.lowRoad ? 88 + wave * 1.5 : 35 + eased * 35 + wave * 2.5;
    const rotate = activeRun.fromRight ? 12 + eased * 5 : -12 - eased * 5;

    scrollFrog.style.setProperty('--frog-opacity', visible);
    scrollFrog.style.setProperty('--frog-x', `${x.toFixed(2)}vw`);
    scrollFrog.style.setProperty('--frog-y', `${y.toFixed(2)}vh`);
    scrollFrog.style.setProperty('--frog-rotate', `${rotate.toFixed(2)}deg`);
}

updateScrollFrog();
window.addEventListener('scroll', updateScrollFrog, { passive: true });
window.addEventListener('resize', () => {
    updateScrollFrog();
    updateCharacterWindow(currentCharacterIndex);
});
