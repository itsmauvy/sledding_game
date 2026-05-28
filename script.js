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
const heroCta = document.querySelector('.hero-content .cta');
const introVideo = document.querySelector('.intro-video');
const introVideoSource = document.querySelector('.intro-video source');
const introDots = document.querySelectorAll('.intro-dot');
const introPrev = document.querySelector('.intro-prev');
const introNext = document.querySelector('.intro-next');
const mediaTabs = document.querySelectorAll('.media-chip');
const mediaPanels = document.querySelectorAll('.media-panel');
const mediaVideoItems = [
    { src: 'media/best sled (2).mp4', label: '최고의 썰매' },
    { src: 'media/silly fwog disappear.mp4', label: '사라지는 개구리' },
    { src: '20260516-0520-43.7799556.mp4', label: '파티 타임' }
];
const mediaImageItems = [
    { src: 'media/media1.webp', label: '단체 사진', alt: 'Sledding Game 단체 사진 이미지' },
    { src: 'media/media2.webp', label: '낚시 모임', alt: 'Sledding Game 낚시 모임 이미지' },
    { src: 'media/media3.webp', label: '베스트 듀오', alt: 'Sledding Game 베스트 듀오 이미지' },
    { src: 'media/media4.webp', label: '눈사람과 나', alt: 'Sledding Game 눈사람과 나 이미지' },
    { src: 'media/media5.webp', label: '한잔의 여유', alt: 'Sledding Game 한잔의 여유 이미지' },
    { src: 'media/image.webp', label: '깐지', alt: 'Sledding Game 깐지 이미지' }
];
const characterTiles = document.querySelectorAll('.character-tile');
const characterPrev = document.querySelector('.character-carousel-button.prev');
const characterNext = document.querySelector('.character-carousel-button.next');
const characterPreviewFace = document.querySelector('.character-preview .character-face');
const characterName = document.querySelector('.character-name');
const characterTag = document.querySelector('.character-tag');
let currentCharacterIndex = 0;
let currentIntroIndex = 0;
let currentLanguage = document.documentElement.lang || 'ko';
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
        introLabel: '우당탕 눈길 레이스',
        introTitle: '게임 소개',
        introCopy: '친구들과 썰매에 올라 눈길을 달려보세요. 방향을 틀고, 점프하고, 서로 부딪히며 끝까지 굴러가는 유쾌한 겨울 레이스가 기다립니다.',
        introSlides: [
            {
                label: '우당탕 눈길 레이스',
                title: '게임 소개',
                copy: '친구들과 썰매에 올라 눈길을 달려보세요. 방향을 틀고, 점프하고, 서로 부딪히며 끝까지 굴러가는 유쾌한 겨울 레이스가 기다립니다.'
            },
            {
                label: '함께 모이는 겨울 방',
                title: '친구와 놀 준비',
                copy: '따뜻한 실내에서 친구들과 만나고, 마음에 드는 캐릭터를 고른 뒤 눈밭으로 나갈 준비를 해보세요.'
            },
            {
                label: '눈밭 위 한판 승부',
                title: '끝까지 굴러가기',
                copy: '넓은 설원에서는 작은 실수도 웃음이 됩니다. 속도를 붙이고, 틈을 찾고, 마지막 순간까지 신나게 미끄러져 보세요.'
            }
        ],
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
        introLabel: 'A Bumpy Snowfield Race',
        introTitle: 'About',
        introCopy: 'Hop on a sled with friends and race across the snow. Turn, jump, bump into each other, and keep rolling toward the finish in a cheerful winter dash.',
        introSlides: [
            {
                label: 'A Bumpy Snowfield Race',
                title: 'About',
                copy: 'Hop on a sled with friends and race across the snow. Turn, jump, bump into each other, and keep rolling toward the finish in a cheerful winter dash.'
            },
            {
                label: 'A Cozy Winter Hangout',
                title: 'Get Ready With Friends',
                copy: 'Meet up indoors, pick a favorite character, and get ready before everyone tumbles back out into the snow.'
            },
            {
                label: 'One Last Snowy Push',
                title: 'Slide to the Finish',
                copy: 'Out on the open snow, every little mistake turns into a laugh. Build speed, find your line, and keep sliding to the end.'
            }
        ],
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
        introLabel: 'どたばた雪道レース',
        introTitle: 'ゲーム紹介',
        introCopy: '友だちとそりに乗って雪道を走りましょう。曲がって、跳んで、ぶつかって、最後まで転がる楽しい冬のレースが待っています。',
        introSlides: [
            {
                label: 'どたばた雪道レース',
                title: 'ゲーム紹介',
                copy: '友だちとそりに乗って雪道を走りましょう。曲がって、跳んで、ぶつかって、最後まで転がる楽しい冬のレースが待っています。'
            },
            {
                label: '冬のたまり場',
                title: '友だちと準備しよう',
                copy: 'あたたかい部屋で仲間と集まり、お気に入りのキャラクターを選んで、雪の世界へ出かける準備をしましょう。'
            },
            {
                label: '雪原のラストスパート',
                title: 'ゴールまで滑ろう',
                copy: '広い雪原では小さなミスも楽しい思い出に。スピードに乗って、最後まで元気に滑り抜けましょう。'
            }
        ],
        characters: 'キャラクター紹介',
        characterCopy: '好きな仲間を選んで雪道を滑りましょう。どのキャラクターも同じコースを少し違う表情で走ります。',
        characterGridLabel: 'キャラクターを選択',
        media: 'メディア',
        news: 'ニュース'
    }
};
const introVideos = [
    '캐릭꾸미기.mp4',
    '미니게임.mp4',
    'download.mp4'
];
const koreanIntroSlides = [
    {
        label: '멋진 외관을 꾸며보세요!',
        headline: '캐릭터 장식과 썰매 아이템',
        title: '게임 소개',
        copy: '포인트를 적립해 나만의 개성이 담긴 스타일을 완성해보세요.'
    },
    {
        label: '다양한 미니게임을 즐겨보세요!',
        headline: '친구들과 함께 재밌는 겨울 액티비티',
        title: '게임 소개',
        copy: '눈싸움, 컬링, 다트 등 다양한 활동으로 친구들과 특별한 시간을 보내보세요.'
    },
    {
        label: '전설의 물고기를 잡아라!',
        headline: '함께라서 더 즐거운 낚시',
        title: '게임 소개',
        copy: '잡은 물고기를 친구들에게 자랑하고 최고의 낚시꾼이 되어보세요.'
    }
];
const frogRuns = [
    { section: document.querySelector('.video-section'), fromRight: true, startAt: 0, endAt: 0.92, viewportLead: 0, startY: 0.7, endY: 0.88 },
    { section: document.querySelector('.intro-section'), fromRight: false, startAt: 0.18, endAt: 0.82, viewportLead: 0.18, startY: 0.68, endY: 0.84 },
    { section: document.querySelector('.character-section'), fromRight: true, startAt: 0.16, endAt: 0.8, viewportLead: 0.18, startY: 0.68, endY: 0.84 },
    { section: document.querySelector('.media-section'), fromRight: false, startAt: 0.16, endAt: 0.8, viewportLead: 0.18, startY: 0.68, endY: 0.84 }
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

function applyMediaItems() {
    const videoPanel = document.querySelector('[data-media-panel="video"]');
    const imagePanel = document.querySelector('[data-media-panel="image"]');
    const firstVideoCard = videoPanel?.querySelector('.media-card');
    const firstImageCard = imagePanel?.querySelector('.media-card');

    while (videoPanel && firstVideoCard && videoPanel.querySelectorAll('.media-card').length < mediaVideoItems.length) {
        videoPanel.appendChild(firstVideoCard.cloneNode(true));
    }

    while (imagePanel && firstImageCard && imagePanel.querySelectorAll('.media-card').length < mediaImageItems.length) {
        imagePanel.appendChild(firstImageCard.cloneNode(true));
    }

    document.querySelectorAll('[data-media-panel="video"] .media-card').forEach((card, index) => {
        const item = mediaVideoItems[index];
        if (!item) {
            card.remove();
            return;
        }

        const source = card.querySelector('source');
        const video = card.querySelector('video');
        const label = card.querySelector('.media-label');
        if (source && source.getAttribute('src') !== item.src) {
            source.setAttribute('src', item.src);
            video?.load();
        }
        if (label) {
            label.textContent = item.label;
        }
    });

    document.querySelectorAll('[data-media-panel="image"] .media-card').forEach((card, index) => {
        const item = mediaImageItems[index];
        if (!item) {
            card.remove();
            return;
        }

        const image = card.querySelector('img');
        const label = card.querySelector('.media-label');
        if (image) {
            image.setAttribute('src', item.src);
            image.setAttribute('alt', item.alt);
        }
        if (label) {
            label.textContent = item.label;
        }
    });
}

applyMediaItems();

function updateIntroText(copy, index = currentIntroIndex) {
    const introSlides = copy.htmlLang === 'ko' ? koreanIntroSlides : copy.introSlides;
    const slide = introSlides?.[index] || {
        label: copy.introLabel,
        title: copy.introTitle,
        copy: copy.introCopy
    };
    const introTitle = document.querySelector('.intro-section-title');
    const introLabel = document.querySelector('.intro-label');
    const introHeadline = document.querySelector('.intro-headline');
    const introCopy = document.querySelector('.intro-copy');

    if (introLabel) {
        introLabel.textContent = slide.label;
    }
    if (introTitle) {
        introTitle.textContent = slide.title;
    }
    if (introHeadline) {
        introHeadline.textContent = slide.headline || '';
    }
    if (introCopy) {
        introCopy.textContent = slide.copy;
    }
}

function setLanguage(lang) {
    const copy = translations[lang] || translations.ko;
    currentLanguage = copy.htmlLang;
    const navLinks = document.querySelectorAll('.nav a');
    const ctaButtons = document.querySelectorAll('.play-link, .cta');
    const characterTitle = document.querySelector('.character-section-title');
    const characterCopy = document.querySelector('.character-copy');
    const characterGrid = document.querySelector('.character-grid');
    const mediaTitle = document.querySelector('.media-section .section-title');
    const newsTitle = document.querySelector('.news-section .section-title');
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
    updateIntroText(copy);
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
    const introSection = document.querySelector('.intro-section');
    currentIntroIndex = (index + introDots.length) % introDots.length;
    if (introSection) {
        introSection.dataset.introSlide = String(currentIntroIndex);
        introSection.classList.remove('is-swapping');
        window.requestAnimationFrame(() => {
            introSection.classList.add('is-swapping');
            window.setTimeout(() => {
                introSection.classList.remove('is-swapping');
            }, 220);
        });
    }
    introDots.forEach((item, itemIndex) => {
        const selected = itemIndex === currentIntroIndex;
        item.classList.toggle('is-active', selected);
        item.setAttribute('aria-pressed', String(selected));
    });

    const copy = translations[currentLanguage] || translations.ko;
    updateIntroText(copy, currentIntroIndex);

    if (introVideos[currentIntroIndex] && introVideoSource.getAttribute('src') !== introVideos[currentIntroIndex]) {
        introVideoSource.setAttribute('src', introVideos[currentIntroIndex]);
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

setIntroDot(currentIntroIndex);

if (heroCta) {
    heroCta.addEventListener('pointerenter', () => heroCta.classList.add('is-hovered'));
    heroCta.addEventListener('pointerleave', () => heroCta.classList.remove('is-hovered'));
    heroCta.addEventListener('focus', () => heroCta.classList.add('is-hovered'));
    heroCta.addEventListener('blur', () => heroCta.classList.remove('is-hovered'));
}

mediaTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.mediaTab;

        mediaTabs.forEach((item) => {
            const selected = item === tab;
            item.classList.toggle('is-active', selected);
            item.setAttribute('aria-pressed', String(selected));
        });

        mediaPanels.forEach((panel) => {
            panel.classList.toggle('is-active', panel.dataset.mediaPanel === target);
        });
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
        if (!run.section) {
            return false;
        }

        const start = run.section.offsetTop + run.section.offsetHeight * (run.startAt ?? 0.25) - window.innerHeight * (run.viewportLead ?? 0.25);
        const end = run.section.offsetTop + run.section.offsetHeight * (run.endAt ?? 0.85);
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

    const eased = smoothstep(progress);
    const fadeIn = clamp(progress / 0.24, 0, 1);
    const fadeOut = clamp((1 - progress) / 0.28, 0, 1);
    const visible = fadeIn * fadeOut;
    const direction = activeRun.fromRight ? 1 : -1;
    const xStart = activeRun.fromRight ? 108 : -8;
    const xEnd = activeRun.fromRight ? -8 : 108;
    const x = xStart + (xEnd - xStart) * eased;
    const yStart = window.innerHeight * (activeRun.startY ?? 0.34);
    const yEnd = window.innerHeight * (activeRun.endY ?? 0.22);
    const y = yStart + (yEnd - yStart) * eased;
    const slopeAngle = Math.atan2(yEnd - yStart, (xEnd - xStart) * window.innerWidth / 100) * 180 / Math.PI;
    const rotate = slopeAngle + (activeRun.fromRight ? 180 : 0);

    scrollFrog.style.setProperty('--frog-opacity', visible);
    scrollFrog.style.setProperty('--frog-x', `${x.toFixed(2)}vw`);
    scrollFrog.style.setProperty('--frog-y', `${y.toFixed(2)}px`);
    scrollFrog.style.setProperty('--frog-rotate', `${rotate.toFixed(2)}deg`);
}

if (scrollFrog) {
    updateScrollFrog();
    window.addEventListener('scroll', updateScrollFrog, { passive: true });
}

window.addEventListener('resize', () => {
    if (scrollFrog) {
        updateScrollFrog();
    }
    updateCharacterWindow(currentCharacterIndex);
});
