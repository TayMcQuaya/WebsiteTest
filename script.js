import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const config = {
  theme: 'system',
  scrub: 0,
  x: 39,
  y: 50,
  scale: 33,
  font: 10,
  svg: false,
  src: 'video/tromptrailer.mp4',
}

const video = document.querySelector('.scrolling-video')

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

// Update function with animation trigger
const update = () => {
  document.documentElement.style.setProperty('--x', config.x)
  document.documentElement.style.setProperty('--y', config.y)
  document.documentElement.style.setProperty('--scale', config.scale)
  document.documentElement.style.setProperty('--font', config.font)
  document.documentElement.dataset.svg = config.svg
  video.src = config.src
  font.disabled = config.svg
  
  // Trigger animation reset
  resetAnimations()
}

// Add animation reset function
const resetAnimations = () => {
  const videoMask = document.querySelector('.video-mask')
  const videoTitle = document.querySelector('.video-mask h1')
  
  if (videoMask && videoTitle) {
    videoMask.style.animation = 'none'
    videoTitle.style.animation = 'none'
    
    // Force reflow
    void videoMask.offsetWidth
    void videoTitle.offsetWidth
    
    // Restart animations
    videoMask.style.animation = ''
    videoTitle.style.animation = ''
  }
}

// Enhanced video timeline initialization
const initializeVideoTimeline = () => {
    const video = document.querySelector('.scrolling-video');
    const videoMask = document.querySelector('.video-mask');
    const videoTitle = document.querySelector('.video-mask h1');
    
    if (video) {
        // Reset styles
        video.style = '';
        if (videoMask) {
            videoMask.style = '';
            // Add intersection observer for animation trigger
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        resetAnimations();
                    }
                });
            }, { threshold: 0.1 }); // Trigger when 10% visible
            
            observer.observe(videoMask);
        }
        if (videoTitle) videoTitle.style = '';
        
        // Initialize video with proper timing
        video.load();
        video.play().catch(error => {
            console.log('Auto-play prevented:', error);
        });

        // Add scroll listener for video timing
        let lastScrollPosition = window.scrollY;
        let scrollDirection = 'down';

        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            scrollDirection = currentScroll > lastScrollPosition ? 'down' : 'up';
            lastScrollPosition = currentScroll;

            // Update video mask opacity based on scroll position
            if (videoMask) {
                const scrollPercentage = (currentScroll / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
                videoMask.style.opacity = scrollPercentage > 30 ? '1' : '0';
            }
        });
    }
};

// Enhanced animation initialization
const initializeAnimations = () => {
    if (isIOS()) {
        document.body.classList.add('ios-device');
        handleIOSFallback();
    } else {
        initializeVideoTimeline();
        setupScrollTriggers();
    }
};

// Add scroll triggers setup
const setupScrollTriggers = () => {
    const videoTimeline = document.querySelector('.video-timeline');
    const contentGrid = document.querySelector('.content-grid-timeline');
    
    if (videoTimeline && contentGrid) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    if (entry.target === contentGrid) {
                        // Trigger content animations
                        document.querySelectorAll('.content-container').forEach(container => {
                            container.style.opacity = '1';
                            container.style.transform = 'translateY(0)';
                        });
                    }
                }
            });
        }, { threshold: 0.1 });

        observer.observe(videoTimeline);
        observer.observe(contentGrid);
    }
};

ctrl.addBinding(config, 'scale', {
  min: 1,
  max: 100,
  step: 1,
  label: 'Scale Start',
})

const origin = ctrl.addFolder({ title: 'Transform Origin' })
origin.addBinding(config, 'x', {
  min: 0,
  max: 100,
  step: 1,
  label: 'X',
})
origin.addBinding(config, 'y', {
  min: 0,
  max: 100,
  step: 1,
  label: 'Y',
})
const font = ctrl.addBinding(config, 'font', {
  min: 1,
  max: 20,
  step: 0.1,
  label: 'Font Level',
})
ctrl.addBinding(config, 'svg', {
  label: 'Use SVG',
})

ctrl.on('change', update)
update()

document.addEventListener('DOMContentLoaded', () => {
    initializeAnimations();
    initializeBuyButtons();
    
    // Add initial animation trigger
    setTimeout(resetAnimations, 100);
});