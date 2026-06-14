const canvas = document.getElementById('animationCanvas');
const context = canvas.getContext('2d');
const frameCount = 240;

// Path in outer directory relative to ezgif
const currentFrame = index => `ezgif_hd/ezgif-frame-${index.toString().padStart(3, '0')}.png`;

const images = [];
let loadedImages = 0;
const progressEl = document.getElementById('progress');
const loaderEl = document.getElementById('loader');

const preloadImages = () => {
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.onload = () => {
            loadedImages++;
            if (progressEl) {
                progressEl.style.width = `${(loadedImages / frameCount) * 100}%`;
            }
            if (loadedImages === frameCount) {
                setTimeout(() => {
                    if (loaderEl) {
                        loaderEl.style.opacity = '0';
                        setTimeout(() => loaderEl.style.display = 'none', 500);
                    }
                }, 500);
            }
        };
        img.src = currentFrame(i);
        images.push(img);
    }
};

const renderInitialFrame = () => {
    if (images[0] && images[0].complete) {
        if (canvas) {
            const parent = canvas.parentElement;
            if (parent) {
                const rect = parent.getBoundingClientRect();
                canvas.width = rect.width;
                canvas.height = rect.height;
            }
        }
        drawImageProp(context, images[0], 0, 0, canvas.width, canvas.height);
    } else {
        setTimeout(renderInitialFrame, 50);
    }
};

function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {
    if (arguments.length === 2) {
        x = y = 0; w = ctx.canvas.width; h = ctx.canvas.height;
    }
    offsetX = typeof offsetX === "number" ? offsetX : 0.5;
    offsetY = typeof offsetY === "number" ? offsetY : 0.5;
    if (offsetX < 0) offsetX = 0; if (offsetY < 0) offsetY = 0;
    if (offsetX > 1) offsetX = 1; if (offsetY > 1) offsetY = 1;
    var iw = img.width, ih = img.height,
        r = Math.min(w / iw, h / ih),
        nw = iw * r, nh = ih * r, cx, cy, cw, ch, ar = 1;
    if (nw < w) ar = w / nw;                             
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  
    nw *= ar; nh *= ar;
    cw = iw / (nw / w); ch = ih / (nh / h);
    cx = (iw - cw) * offsetX; cy = (ih - ch) * offsetY;
    if (cx < 0) cx = 0; if (cy < 0) cy = 0;
    if (cw > iw) cw = iw; if (ch > ih) ch = ih;
    ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
}

const updateImage = index => {
    if (images[index] && context) {
        drawImageProp(context, images[index], 0, 0, canvas.width, canvas.height);
    }
}

function updateCanvasFromScroll() {
    const section = document.getElementById('animationSection');
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top; 
    const sectionHeight = rect.height;
    
    const maxScroll = sectionHeight - window.innerHeight;
    let scrollFraction = -sectionTop / maxScroll;
    
    if (scrollFraction < 0) scrollFraction = 0;
    if (scrollFraction > 1) scrollFraction = 1;

    const frameIndex = Math.min(frameCount - 1, Math.ceil(scrollFraction * frameCount));
    
    updateImage(frameIndex);

    const heroTitles = document.getElementById('heroTitles');
    if (heroTitles) {
        if (scrollFraction <= 0.1) {
            heroTitles.style.opacity = '1';
            heroTitles.style.transform = 'translateY(0)';
        } else if (scrollFraction <= 0.3) {
            const progress = (scrollFraction - 0.1) / 0.2;
            heroTitles.style.opacity = (1 - progress).toString();
            heroTitles.style.transform = `translateY(-${progress * 20}px)`;
        } else {
            heroTitles.style.opacity = '0';
            heroTitles.style.transform = 'translateY(-20px)';
        }
    }
}

let lastWidth = window.innerWidth;
window.addEventListener('resize', () => {
    if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        if (canvas) {
            const parent = canvas.parentElement;
            if (parent) {
                const rect = parent.getBoundingClientRect();
                canvas.width = rect.width || window.innerWidth;
                canvas.height = rect.height || window.innerHeight;
            }
            updateCanvasFromScroll();
        }
    }
});
window.addEventListener('scroll', updateCanvasFromScroll, { passive: true });

// Initialize Smooth Scrolling (Lenis)
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

// Mobile Menu Toggle state
let menuOpen = false;

lenis.on('scroll', (e) => {
    updateCanvasFromScroll();
    
    const navbar = document.getElementById('navbar');
    const animationSection = document.getElementById('animationSection');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    if (navbar && animationSection) {
        if (window.scrollY > animationSection.offsetHeight - 100) {
            navbar.classList.remove('text-white', 'bg-transparent');
            navbar.classList.add('text-primary', 'bg-white/90', 'backdrop-blur-md', 'shadow-sm');
            if(!menuOpen && mobileMenuBtn) {
                mobileMenuBtn.classList.remove('text-white');
                mobileMenuBtn.classList.add('text-primary');
            }
        } else {
            navbar.classList.add('text-white', 'bg-transparent');
            navbar.classList.remove('text-primary', 'bg-white/90', 'backdrop-blur-md', 'shadow-sm');
            if(!menuOpen && mobileMenuBtn) {
                mobileMenuBtn.classList.remove('text-primary');
                mobileMenuBtn.classList.add('text-white');
            }
        }
    }
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

if (canvas) {
    preloadImages();
    renderInitialFrame();
}

// Initialize AOS
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
    });
}

// Mobile Menu functionality
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        menuOpen = !menuOpen;
        mobileMenu.classList.toggle('open');
        const spans = mobileMenuBtn.querySelectorAll('span');
        if(menuOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            mobileMenuBtn.classList.remove('text-primary');
            mobileMenuBtn.classList.add('text-white');
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
            // Reset color based on scroll
            const navbar = document.getElementById('navbar');
            if(navbar && navbar.classList.contains('bg-white/90')) {
                mobileMenuBtn.classList.replace('text-white', 'text-primary');
            } else {
                mobileMenuBtn.classList.replace('text-primary', 'text-white');
            }
        }
    });
}

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        if(menuOpen && mobileMenuBtn) mobileMenuBtn.click();
    });
});

// Magnetic Button
const magneticBtns = document.querySelectorAll('.magnetic-btn');
magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
    });
});
