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
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let gsap = window.gsap;
let ScrollTrigger = window.ScrollTrigger;
let canUseGsap = Boolean(gsap) && !prefersReducedMotion;
let canUseScrollTrigger = canUseGsap && Boolean(ScrollTrigger);
const trailerOpenButton = document.querySelector('.trailer-open-button');
const trailerModal = document.querySelector('.trailer-modal');
const trailerModalVideo = document.querySelector('.trailer-modal-video');
const trailerCloseButtons = document.querySelectorAll('.trailer-close-button, .trailer-modal-backdrop');
const scrollFrog = document.querySelector('.scroll-frog');
const soundtrackAudio = document.querySelector('.soundtrack-audio');
const languagePicker = document.querySelector('.language-picker');
const languageButton = document.querySelector('.language-button');
const languageOptions = document.querySelectorAll('.language-option');
const musicButton = document.querySelector('.music-button');
const heroCtaButtons = document.querySelectorAll('.hero-content .cta');
const introVideo = document.querySelector('.intro-video');
const introVideoSource = document.querySelector('.intro-video source');
const introDots = document.querySelectorAll('.intro-dot');
const introPrev = document.querySelector('.intro-prev');
const introNext = document.querySelector('.intro-next');
const mediaTabs = document.querySelectorAll('.media-chip');
const mediaPanels = document.querySelectorAll('.media-panel');
const mediaWrap = document.querySelector('.media-wrap');
const mediaImagePanel = document.querySelector('[data-media-panel="image"]');
const mediaSledScroll = document.querySelector('.media-sled-scroll');
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
    { src: 'media/image.webp', label: '간지난다', alt: 'Sledding Game 간지난다 이미지' }
];
const characterTiles = document.querySelectorAll('.character-tile');
const characterPrev = document.querySelector('.character-carousel-button.prev');
const characterNext = document.querySelector('.character-carousel-button.next');
const characterPreviewFace = document.querySelector('.character-preview .character-face');
const characterPreview = document.querySelector('.character-preview');
const characterName = document.querySelector('.character-name');
const newsSection = document.querySelector('.news-section');
const newsCards = document.querySelectorAll('.news-card');
let currentCharacterIndex = 0;
let currentIntroIndex = 0;
let currentLanguage = document.documentElement.lang || 'ko';
let activeNewsCardIndex = 0;
let newsFrogPlayer = null;
let mediaSledTargetScroll = 0;
let mediaSledAnimationFrame = null;
let mediaSledTween = null;
let gsapMotionInitialized = false;

function refreshGsapAvailability() {
    gsap = window.gsap;
    ScrollTrigger = window.ScrollTrigger;
    canUseGsap = Boolean(gsap) && !prefersReducedMotion;
    canUseScrollTrigger = canUseGsap && Boolean(ScrollTrigger);

    if (canUseGsap) {
        body.classList.add('has-gsap');
    }

    if (canUseScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }
}

refreshGsapAvailability();
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
        trailer: '게임 영상 보기',
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
        trailer: 'Watch Trailer',
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
        headline: '다양한 캐릭터 장식과<br>썰매 아이템',
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
    { section: document.querySelector('.video-section'), fromRight: true, startAt: 0.05, endAt: 0.58, viewportLead: 0, startX: 108, endX: -4, sectionY: 0.92, rotate: -6 }
];

function revealSite() {
    if (body.classList.contains('is-ready')) {
        return;
    }

    if (!canUseGsap) {
        body.classList.add('is-ready');
        return;
    }

    const loaderScreen = document.querySelector('.loader-screen');
    const loader = document.querySelector('.loader');
    const heroContent = document.querySelector('.hero-content');
    const trailerWrap = document.querySelector('.trailer-wrap');
    const trackBand = document.querySelector('.video-section .track-band');
    const headerItems = document.querySelectorAll('.site-header > *');
    const heroItems = document.querySelectorAll('.hero-kicker, .hero-title, .hero-copy, .hero-actions');

    gsap.set('.site-header', { opacity: 1, y: 0 });
    gsap.set(headerItems, { opacity: 0, y: -16 });
    gsap.set('.page-section', { opacity: 1, y: 0 });
    gsap.set(heroContent, { opacity: 1 });
    gsap.set(heroItems, { opacity: 0, y: 28 });
    gsap.set(trailerWrap, { scale: 1.035, filter: 'saturate(0.92) brightness(0.9)' });
    gsap.set(trackBand, { opacity: 0, yPercent: 10, rotate: -8 });

    body.classList.add('is-ready');

    gsap.timeline({ defaults: { ease: 'power3.out' } })
        .to(loader, { opacity: 0, y: -24, scale: 0.94, duration: 0.45 }, 0)
        .to(loaderScreen, {
            opacity: 0,
            filter: 'blur(12px) saturate(1.1)',
            visibility: 'hidden',
            duration: 0.78,
            onComplete: () => {
                gsap.set(loaderScreen, { pointerEvents: 'none' });
                ScrollTrigger?.refresh();
            }
        }, 0.08)
        .to(trailerWrap, { scale: 1, filter: 'saturate(1) brightness(1)', duration: 1.25 }, 0.16)
        .to(headerItems, { opacity: 1, y: 0, duration: 0.58, stagger: 0.055 }, 0.34)
        .to(heroItems, { opacity: 1, y: 0, duration: 0.78, stagger: 0.09 }, 0.42)
        .to(trackBand, { opacity: 1, yPercent: 0, rotate: -6, duration: 0.9 }, 0.48);
}

window.setTimeout(revealSite, 2400);

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

        if (index > 0) {
            card.querySelector('.media-perched-frog')?.remove();
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

function updateMediaSledScroll() {
    if (!mediaWrap || !mediaImagePanel) {
        return;
    }

    const maxScroll = mediaImagePanel.scrollWidth - mediaImagePanel.clientWidth;
    const progress = maxScroll > 0 ? mediaImagePanel.scrollLeft / maxScroll : 0;
    mediaWrap.style.setProperty('--media-sled-progress', clamp(progress, 0, 1).toFixed(4));
}

function stopMediaSledAnimation() {
    if (mediaSledAnimationFrame !== null) {
        window.cancelAnimationFrame(mediaSledAnimationFrame);
        mediaSledAnimationFrame = null;
    }
    if (mediaSledTween) {
        mediaSledTween.kill();
        mediaSledTween = null;
    }
}

function animateMediaImageScroll() {
    if (!mediaImagePanel) {
        return;
    }

    const delta = mediaSledTargetScroll - mediaImagePanel.scrollLeft;
    if (Math.abs(delta) < 0.7) {
        mediaImagePanel.scrollLeft = mediaSledTargetScroll;
        updateMediaSledScroll();
        mediaSledAnimationFrame = null;
        return;
    }

    mediaImagePanel.scrollLeft += delta * 0.22;
    updateMediaSledScroll();
    mediaSledAnimationFrame = window.requestAnimationFrame(animateMediaImageScroll);
}

function glideMediaImageScroll(targetScroll) {
    if (!mediaImagePanel) {
        return;
    }

    const maxScroll = mediaImagePanel.scrollWidth - mediaImagePanel.clientWidth;
    mediaSledTargetScroll = clamp(targetScroll, 0, maxScroll);

    if (canUseGsap) {
        stopMediaSledAnimation();
        mediaSledTween = gsap.to(mediaImagePanel, {
            scrollLeft: mediaSledTargetScroll,
            duration: 0.58,
            ease: 'power3.out',
            onUpdate: updateMediaSledScroll,
            onComplete: () => {
                mediaSledTween = null;
                updateMediaSledScroll();
            }
        });
        return;
    }

    if (mediaSledAnimationFrame === null) {
        mediaSledAnimationFrame = window.requestAnimationFrame(animateMediaImageScroll);
    }
}

function setMediaImageScrollFromPoint(clientX) {
    if (!mediaSledScroll || !mediaImagePanel) {
        return;
    }

    const rect = mediaSledScroll.getBoundingClientRect();
    const progress = clamp((clientX - rect.left) / rect.width, 0, 1);
    glideMediaImageScroll(progress * (mediaImagePanel.scrollWidth - mediaImagePanel.clientWidth));
}

function setupMediaPanelDrag() {
    const draggablePanels = document.querySelectorAll('[data-media-panel="image"]');

    draggablePanels.forEach((panel) => {
        let isDragging = false;
        let startX = 0;
        let startScrollLeft = 0;
        let pointerId = null;

        panel.addEventListener('pointerdown', (event) => {
            if (event.button !== 0) {
                return;
            }

            isDragging = true;
            pointerId = event.pointerId;
            startX = event.clientX;
            startScrollLeft = panel.scrollLeft;
            panel.classList.add('is-dragging');
            panel.setPointerCapture(pointerId);
        });

        panel.addEventListener('pointermove', (event) => {
            if (!isDragging) {
                return;
            }

            event.preventDefault();
            stopMediaSledAnimation();
            panel.scrollLeft = startScrollLeft - (event.clientX - startX);
            updateMediaSledScroll();
        });

        function endDrag() {
            if (!isDragging) {
                return;
            }

            isDragging = false;
            panel.classList.remove('is-dragging');
            if (pointerId !== null && panel.hasPointerCapture(pointerId)) {
                panel.releasePointerCapture(pointerId);
            }
            pointerId = null;
        }

        panel.addEventListener('pointerup', endDrag);
        panel.addEventListener('pointercancel', endDrag);
        panel.addEventListener('pointerleave', endDrag);
        panel.addEventListener('scroll', updateMediaSledScroll, { passive: true });
    });
}

setupMediaPanelDrag();

function setupMediaSledScrollbar() {
    if (!mediaSledScroll || !mediaImagePanel) {
        return;
    }

    let isDragging = false;
    let pointerId = null;

    mediaSledScroll.addEventListener('pointerdown', (event) => {
        if (event.button !== 0) {
            return;
        }

        isDragging = true;
        pointerId = event.pointerId;
        mediaSledScroll.classList.add('is-dragging');
        mediaSledScroll.setPointerCapture(pointerId);
        setMediaImageScrollFromPoint(event.clientX);
    });

    mediaSledScroll.addEventListener('pointermove', (event) => {
        if (!isDragging) {
            return;
        }

        setMediaImageScrollFromPoint(event.clientX);
    });

    function endSledDrag() {
        if (!isDragging) {
            return;
        }

        isDragging = false;
        mediaSledScroll.classList.remove('is-dragging');
        if (pointerId !== null && mediaSledScroll.hasPointerCapture(pointerId)) {
            mediaSledScroll.releasePointerCapture(pointerId);
        }
        pointerId = null;
    }

    mediaSledScroll.addEventListener('pointerup', endSledDrag);
    mediaSledScroll.addEventListener('pointercancel', endSledDrag);
    mediaSledScroll.addEventListener('pointerleave', endSledDrag);
}

setupMediaSledScrollbar();
updateMediaSledScroll();

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
        introHeadline.innerHTML = slide.headline || '';
    }
    if (introCopy) {
        introCopy.textContent = slide.copy;
    }
}

function setLanguage(lang) {
    const copy = translations[lang] || translations.ko;
    currentLanguage = copy.htmlLang;
    const navLinks = document.querySelectorAll('.nav a');
    const playButtons = document.querySelectorAll('.play-link, .hero-play-link');
    const trailerButtons = document.querySelectorAll('.trailer-open-button');
    const characterTitle = document.querySelector('.character-section-title');
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

    playButtons.forEach((button) => {
        button.textContent = copy.play;
    });

    trailerButtons.forEach((button) => {
        button.textContent = copy.trailer;
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

function triggerCharacterJump() {
    if (!characterPreview) {
        return;
    }

    if (canUseGsap) {
        gsap.killTweensOf([characterPreview, characterPreviewFace]);
        gsap.timeline({ defaults: { ease: 'power2.out' } })
            .to(characterPreview, { y: -22, rotation: -3, duration: 0.18 })
            .to(characterPreview, { y: 0, rotation: 0, duration: 0.48, ease: 'bounce.out' })
            .fromTo(characterPreviewFace, { scale: 0.96 }, { scale: 1.04, duration: 0.18, yoyo: true, repeat: 1 }, 0.08);
        return;
    }

    characterPreview.classList.remove('is-jumping');
    characterPreviewFace.classList.remove('is-bouncing');
    void characterPreview.offsetWidth;
    characterPreview.classList.add('is-jumping');
    characterPreviewFace.classList.add('is-bouncing');
    window.setTimeout(() => {
        characterPreview.classList.remove('is-jumping');
        characterPreviewFace.classList.remove('is-bouncing');
    }, 860);
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
    updateCharacterWindow(currentCharacterIndex);
    triggerCharacterJump();
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

characterPreviewFace.setAttribute('role', 'button');
characterPreviewFace.setAttribute('tabindex', '0');
characterPreviewFace.setAttribute('aria-label', '캐릭터 모션 보기');
characterPreviewFace.addEventListener('click', triggerCharacterJump);
characterPreviewFace.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        triggerCharacterJump();
    }
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

heroCtaButtons.forEach((button) => {
    button.addEventListener('pointerenter', () => button.classList.add('is-hovered'));
    button.addEventListener('pointerleave', () => button.classList.remove('is-hovered'));
    button.addEventListener('focus', () => button.classList.add('is-hovered'));
    button.addEventListener('blur', () => button.classList.remove('is-hovered'));
});

function closeTrailerModal() {
    if (!trailerModal) {
        return;
    }

    if (canUseGsap && !trailerModal.hidden) {
        const dialog = trailerModal.querySelector('.trailer-dialog');
        gsap.timeline({
            defaults: { ease: 'power2.inOut' },
            onComplete: () => {
                trailerModal.hidden = true;
                body.classList.remove('has-trailer-modal');
                trailerModalVideo?.pause();
                gsap.set(trailerModal, { clearProps: 'opacity,visibility' });
                gsap.set(dialog, { clearProps: 'transform,opacity' });
            }
        })
            .to(dialog, { opacity: 0, y: 18, scale: 0.97, duration: 0.18 }, 0)
            .to(trailerModal, { opacity: 0, duration: 0.22 }, 0);
        return;
    }

    trailerModal.hidden = true;
    body.classList.remove('has-trailer-modal');
    trailerModalVideo?.pause();
}

trailerOpenButton?.addEventListener('click', async () => {
    if (!trailerModal) {
        return;
    }

    trailerModal.hidden = false;
    body.classList.add('has-trailer-modal');
    if (canUseGsap) {
        const dialog = trailerModal.querySelector('.trailer-dialog');
        gsap.killTweensOf([trailerModal, dialog]);
        gsap.fromTo(trailerModal, { opacity: 0 }, { opacity: 1, duration: 0.24, ease: 'power2.out' });
        gsap.fromTo(dialog, { opacity: 0, y: 28, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.38, ease: 'back.out(1.35)' });
    }
    if (trailerModalVideo) {
        trailerModalVideo.currentTime = 0;
        try {
            await trailerModalVideo.play();
        } catch (error) {
            trailerModalVideo.controls = true;
        }
    }
});

trailerCloseButtons.forEach((button) => {
    button.addEventListener('click', closeTrailerModal);
});

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
        if (canUseGsap) {
            const activePanel = document.querySelector(`.media-panel[data-media-panel="${target}"]`);
            const activeCards = activePanel?.querySelectorAll('.media-card');
            gsap.fromTo(activeCards, { opacity: 0, y: 24, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.48, stagger: 0.055, ease: 'power3.out' });
        }
        window.requestAnimationFrame(updateMediaSledScroll);
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
    if (event.key === 'Escape' && trailerModal && !trailerModal.hidden) {
        closeTrailerModal();
        return;
    }

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

function initGsapSectionReveals() {
    if (!canUseScrollTrigger) {
        return;
    }

    const revealGroups = [
        '.character-section .section-title, .character-stage, .character-grid, .character-carousel',
        '.media-section .section-title, .media-tabs, .media-card, .media-sled-scroll',
        '.news-section .section-title, .news-feature, .news-card'
    ];

    revealGroups.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (!elements.length) {
            return;
        }

        gsap.from(elements, {
            opacity: 0,
            y: 46,
            duration: 0.76,
            stagger: 0.075,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: elements[0].closest('.page-section') || elements[0],
                start: 'top 72%',
                once: true
            }
        });
    });
}

function initGsapHoverMotion() {
    if (!canUseGsap) {
        return;
    }

    const liftTargets = document.querySelectorAll('.media-card, .news-card, .character-tile');
    liftTargets.forEach((target) => {
        target.addEventListener('pointerenter', () => {
            gsap.to(target, { y: -7, scale: 1.015, duration: 0.24, ease: 'power2.out', overwrite: 'auto' });
        });
        target.addEventListener('pointerleave', () => {
            gsap.to(target, { y: 0, scale: 1, duration: 0.28, ease: 'power2.out', overwrite: 'auto' });
        });
    });

    heroCtaButtons.forEach((button) => {
        button.addEventListener('pointerenter', () => {
            gsap.to(button, { y: 4, scale: 1.025, duration: 0.2, ease: 'power2.out', overwrite: 'auto' });
        });
        button.addEventListener('pointerleave', () => {
            gsap.to(button, { y: 0, scale: 1, duration: 0.24, ease: 'power2.out', overwrite: 'auto' });
        });
    });
}

function initGsapIntroMotion() {
    if (!canUseGsap) {
        return;
    }

    const introSection = document.querySelector('.intro-section');
    const introShowcase = document.querySelector('.intro-showcase');
    const introTitle = document.querySelector('.intro-section-title');
    const introDots = document.querySelectorAll('.intro-dot');
    const introText = document.querySelectorAll('.intro-label, .intro-headline, .intro-copy');
    const introArrows = document.querySelectorAll('.intro-arrow');

    const introTimeline = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: canUseScrollTrigger ? {
            trigger: introSection,
            start: 'top 42%',
            once: true
        } : undefined
    });

    if (introTitle) {
        introTimeline.from(introTitle, {
            opacity: 0,
            y: 58,
            duration: 0.72
        }, 0);
    }

    if (introDots.length) {
        introTimeline.from(introDots, {
            opacity: 0,
            y: 28,
            scale: 0.94,
            duration: 0.46,
            stagger: 0.07
        }, 0.18);
    }

    if (introText.length) {
        introTimeline.from(introText, {
            opacity: 0,
            y: 44,
            duration: 0.62,
            stagger: 0.08
        }, 0.32);
    }

    if (introShowcase) {
        introTimeline.from(introShowcase, {
            opacity: 0,
            y: 42,
            rotateZ: -7,
            scale: 0.96,
            duration: 0.72
        }, 0.4);
    }

    if (introArrows.length) {
        introTimeline.from(introArrows, {
            opacity: 0,
            scale: 0.86,
            duration: 0.38,
            stagger: 0.06
        }, 0.58);
    }

    if (introShowcase) {
        gsap.set(introShowcase, { transformPerspective: 1000, transformOrigin: '50% 50%' });
        introShowcase.addEventListener('pointermove', (event) => {
            const rect = introShowcase.getBoundingClientRect();
            const xRatio = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
            const yRatio = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
            const cornerPull = Math.max(Math.abs(xRatio), Math.abs(yRatio));

            gsap.to(introShowcase, {
                x: xRatio * 18,
                y: yRatio * 12,
                rotateX: yRatio * -8,
                rotateY: xRatio * 11,
                rotateZ: -4 + xRatio * 1.8,
                scale: 1.01 + cornerPull * 0.012,
                duration: 0.34,
                ease: 'power3.out',
                overwrite: 'auto'
            });
        });

        introShowcase.addEventListener('pointerleave', () => {
            gsap.to(introShowcase, {
                x: 0,
                y: 0,
                rotateX: 0,
                rotateY: 0,
                rotateZ: -4,
                scale: 1,
                duration: 0.58,
                ease: 'elastic.out(1, 0.65)',
                overwrite: 'auto'
            });
        });
    }
}

function initGsapScrollFrog() {
    if (!canUseScrollTrigger || !scrollFrog) {
        return;
    }

    window.removeEventListener('scroll', updateScrollFrog);

    frogRuns.forEach((run) => {
        if (!run.section) {
            return;
        }

        const xStart = `${run.startX ?? (run.fromRight ? 108 : -8)}vw`;
        const xEnd = `${run.endX ?? (run.fromRight ? -8 : 108)}vw`;
        const rotation = run.rotate ?? -6;
        const travelHalf = (Math.abs((run.startX ?? 108) - (run.endX ?? -4))) / 2;

        // Slope delta: frog goes from high (right) to low (left) along -6deg slope
        const getSlopeDelta = () => Math.tan(Math.abs(rotation) * Math.PI / 180) * travelHalf * window.innerWidth / 100;

        const baseY = run.section.offsetHeight * (run.sectionY ?? 0.92);
        gsap.set(scrollFrog, { left: 0, top: baseY, xPercent: -50, yPercent: -50 });

        const scrollStart = run.section.offsetTop;
        const scrollEnd = run.section.offsetTop + run.section.offsetHeight * (run.endAt ?? 0.58);

        gsap.timeline({
            scrollTrigger: {
                scroller: document.body.scrollHeight > window.innerHeight ? undefined : document.body,
                trigger: run.section,
                start: scrollStart,
                end: scrollEnd,
                scrub: 0.35,
                invalidateOnRefresh: true
            }
        })
            .fromTo(scrollFrog, {
                autoAlpha: 0,
            }, {
                autoAlpha: 1,
                duration: 0.12,
                ease: 'power1.out'
            }, 0)
            .fromTo(scrollFrog, {
                x: xStart,
                y: () => -getSlopeDelta(),
                rotation
            }, {
                x: xEnd,
                y: () => getSlopeDelta(),
                rotation: rotation + 4,
                duration: 0.78,
                ease: 'none'
            }, 0)
            .to(scrollFrog, { autoAlpha: 0, duration: 0.14, ease: 'none' }, 0.8);
    });
}

function initGsapMotion() {
    refreshGsapAvailability();
    if (!canUseGsap || gsapMotionInitialized) {
        return;
    }

    gsapMotionInitialized = true;
    initGsapSectionReveals();
    initGsapHoverMotion();
    initGsapIntroMotion();
    initGsapScrollFrog();
    initCharacterDragDrop();
    ScrollTrigger?.refresh();
}

window.initGsapEnhancements = initGsapMotion;
globalThis.initGsapEnhancements = initGsapMotion;

function ensureNewsFrogPlayer() {
    if (!newsSection || !newsCards.length) {
        return null;
    }

    if (!newsFrogPlayer) {
        newsFrogPlayer = document.createElement('img');
        newsFrogPlayer.className = 'news-frog-player';
        newsFrogPlayer.src = 'images/frog3.png';
        newsFrogPlayer.alt = '';
        newsSection.append(newsFrogPlayer);
    }

    return newsFrogPlayer;
}

function setNewsFrogTarget(index) {
    newsCards.forEach((card, cardIndex) => {
        card.classList.toggle('is-news-frog-target', cardIndex === index);
    });
}

function placeNewsFrog(index, motion = 'hop') {
    const frog = ensureNewsFrogPlayer();

    if (!frog) {
        return;
    }

    activeNewsCardIndex = clamp(index, 0, newsCards.length - 1);
    const targetCard = newsCards[activeNewsCardIndex];
    const sectionRect = newsSection.getBoundingClientRect();
    const cardRect = targetCard.getBoundingClientRect();
    const x = cardRect.left - sectionRect.left + cardRect.width * 0.82;
    const y = cardRect.top - sectionRect.top + Math.min(cardRect.height * 0.34, 104);

    frog.style.setProperty('--news-frog-x', `${x}px`);
    frog.style.setProperty('--news-frog-y', `${y}px`);
    frog.style.setProperty('--news-frog-rotate', activeNewsCardIndex % 2 ? '-7deg' : '5deg');
    setNewsFrogTarget(activeNewsCardIndex);

    if (motion) {
        frog.classList.remove('is-hopping', 'is-falling');
        void frog.offsetWidth;
        frog.classList.add(motion === 'fall' ? 'is-falling' : 'is-hopping');
    }
}

function moveNewsFrog(delta) {
    if (!newsSection || !newsCards.length) {
        return;
    }

    const nextIndex = clamp(activeNewsCardIndex + delta, 0, newsCards.length - 1);

    if (nextIndex === activeNewsCardIndex) {
        placeNewsFrog(activeNewsCardIndex, 'hop');
        return;
    }

    const frog = ensureNewsFrogPlayer();
    const currentRect = newsCards[activeNewsCardIndex].getBoundingClientRect();
    const nextRect = newsCards[nextIndex].getBoundingClientRect();
    const sectionRect = newsSection.getBoundingClientRect();
    const gapX = (currentRect.left + currentRect.width / 2 + nextRect.left + nextRect.width / 2) / 2 - sectionRect.left;
    const gapY = Math.max(currentRect.bottom, nextRect.bottom) - sectionRect.top + 18;

    if (frog) {
        frog.style.setProperty('--news-frog-x', `${gapX}px`);
        frog.style.setProperty('--news-frog-y', `${gapY}px`);
        frog.style.setProperty('--news-frog-rotate', delta > 0 ? '15deg' : '-15deg');
        frog.classList.remove('is-hopping', 'is-falling');
        void frog.offsetWidth;
        frog.classList.add('is-falling');
    }

    window.setTimeout(() => {
        placeNewsFrog(nextIndex, 'hop');
    }, 230);
}

document.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
        return;
    }

    if (!newsSection) {
        return;
    }

    const rect = newsSection.getBoundingClientRect();
    const newsIsVisible = rect.top < window.innerHeight * 0.92 && rect.bottom > window.innerHeight * 0.08;

    if (!newsIsVisible) {
        return;
    }

    event.preventDefault();

    if (event.key === 'ArrowLeft') {
        moveNewsFrog(-1);
    } else if (event.key === 'ArrowRight') {
        moveNewsFrog(1);
    } else if (event.key === 'ArrowDown') {
        placeNewsFrog(activeNewsCardIndex, 'fall');
    } else {
        placeNewsFrog(activeNewsCardIndex, 'hop');
    }
});

placeNewsFrog(activeNewsCardIndex, '');
initGsapMotion();

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
    const fadeIn = clamp(progress / 0.12, 0, 1);
    const fadeOut = clamp((1 - progress) / 0.18, 0, 1);
    const visible = fadeIn * fadeOut;
    const xStart = activeRun.startX ?? (activeRun.fromRight ? 108 : -8);
    const xEnd = activeRun.endX ?? (activeRun.fromRight ? -8 : 108);
    const x = xStart + (xEnd - xStart) * eased;
    const rotate = activeRun.rotate ?? -6;
    const travelHalf = Math.abs(xStart - xEnd) / 2;
    const slopeDelta = Math.tan(Math.abs(rotate) * Math.PI / 180) * travelHalf * window.innerWidth / 100;
    const baseY = activeRun.section.offsetHeight * (activeRun.sectionY ?? 0.92);
    const y = baseY + (eased * 2 - 1) * slopeDelta;

    scrollFrog.style.setProperty('--frog-opacity', visible);
    scrollFrog.style.setProperty('--frog-x', `${x.toFixed(2)}vw`);
    scrollFrog.style.setProperty('--frog-y', `${y.toFixed(2)}px`);
    scrollFrog.style.setProperty('--frog-rotate', `${rotate.toFixed(2)}deg`);
}

if (scrollFrog && !canUseScrollTrigger) {
    updateScrollFrog();
    window.addEventListener('scroll', updateScrollFrog, { passive: true });
}

window.addEventListener('resize', () => {
    if (scrollFrog) {
        updateScrollFrog();
    }
    updateCharacterWindow(currentCharacterIndex);
    placeNewsFrog(activeNewsCardIndex, '');
});

// ── Snow particles ────────────────────────────────────
function initSnow() {
    if (prefersReducedMotion) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'snow-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const COUNT = 55;
    const flakes = [];

    function makeFlake(ry) {
        return {
            x: Math.random() * window.innerWidth,
            y: ry ?? -6,
            r: Math.random() * 2.2 + 0.7,
            vy: Math.random() * 0.9 + 0.3,
            vx: (Math.random() - 0.5) * 0.3,
            wobble: Math.random() * Math.PI * 2,
            ws: Math.random() * 0.016 + 0.004,
            alpha: Math.random() * 0.42 + 0.16
        };
    }

    for (let i = 0; i < COUNT; i++) flakes.push(makeFlake(Math.random() * window.innerHeight));

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function tick() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        for (const f of flakes) {
            f.wobble += f.ws;
            f.x += f.vx + Math.sin(f.wobble) * 0.25;
            f.y += f.vy;
            if (f.y > canvas.height + 8) Object.assign(f, makeFlake());
            ctx.globalAlpha = f.alpha;
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });
    tick();
}

// ── Character drag & fall ─────────────────────────────
function initCharacterDragDrop() {
    if (!canUseGsap || prefersReducedMotion) return;

    const preview = document.querySelector('.character-preview');
    if (!preview) return;

    let dragging = false;
    let startX = 0, startY = 0;

    preview.addEventListener('mousedown', (e) => {
        e.preventDefault();
        dragging = true;
        startX = e.clientX;
        startY = e.clientY;
        gsap.killTweensOf(preview);
        preview.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        gsap.set(preview, { x: dx, y: dy });
    });

    document.addEventListener('mouseup', (e) => {
        if (!dragging) return;
        dragging = false;
        preview.style.cursor = 'grab';
        document.body.style.userSelect = '';

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const fallDist = Math.max(80, Math.abs(dy) * 0.5 + 80);
        const tilt = dx > 0 ? 12 : -12;

        gsap.timeline()
            .to(preview, {
                y: dy + fallDist,
                rotation: tilt,
                scale: 0.94,
                duration: 0.22,
                ease: 'power2.in'
            })
            .to(preview, {
                x: 0, y: 0, rotation: 0, scale: 1,
                duration: 0.68,
                ease: 'bounce.out'
            });
    });
}

// ── Cursor trail + snowball click ─────────────────────
function initCursorEffects() {
    if (prefersReducedMotion) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'cursor-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let trail = [];
    let splats = [];
    let lastTrailX = -999, lastTrailY = -999;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    document.addEventListener('mousemove', (e) => {
        const dx = e.clientX - lastTrailX;
        const dy = e.clientY - lastTrailY;
        if (dx * dx + dy * dy < 100) return; // throttle by distance
        lastTrailX = e.clientX;
        lastTrailY = e.clientY;

        const count = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < count; i++) {
            trail.push({
                x: e.clientX + (Math.random() - 0.5) * 8,
                y: e.clientY + (Math.random() - 0.5) * 8,
                r: Math.random() * 2.2 + 0.6,
                vx: (Math.random() - 0.5) * 0.5,
                vy: Math.random() * 0.6 + 0.1,
                life: 1
            });
        }
    }, { passive: true });

    document.addEventListener('click', (e) => {
        if (e.target.closest('button, a, input, select, .character-preview, .character-tile')) return;

        // Burst ring
        const count = 14;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const speed = Math.random() * 4 + 2;
            splats.push({
                x: e.clientX,
                y: e.clientY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1.5,
                r: Math.random() * 4.5 + 1.5,
                life: 1,
                type: 'burst'
            });
        }
        // Central splat blob
        splats.push({ x: e.clientX, y: e.clientY, vx: 0, vy: 0, r: 10, life: 1, type: 'blob' });
    });

    function tick() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Trail
        trail = trail.filter(p => p.life > 0.03);
        for (const p of trail) {
            p.x += p.vx; p.y += p.vy;
            p.life -= 0.055;
            ctx.globalAlpha = p.life * 0.55;
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        }

        // Splat
        splats = splats.filter(s => s.life > 0.02);
        for (const s of splats) {
            if (s.type === 'burst') {
                s.x += s.vx; s.y += s.vy;
                s.vy += 0.15;
                s.vx *= 0.97;
                s.life -= 0.028;
                ctx.globalAlpha = s.life * 0.85;
                ctx.fillStyle = '#dff3ff';
            } else {
                s.life -= 0.04;
                s.r += 0.4;
                ctx.globalAlpha = s.life * 0.35;
                ctx.fillStyle = '#fff';
            }
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalAlpha = 1;
        requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });
    tick();
}

initSnow();
initCursorEffects();
