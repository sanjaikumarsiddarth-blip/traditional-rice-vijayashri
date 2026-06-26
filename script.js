// Enable JS class to hide elements before animation loads
document.documentElement.classList.add("js-enabled");

document.addEventListener("DOMContentLoaded", () => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // ==========================================================================
    // LENIS SMOOTH SCROLLING
    // ==========================================================================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // ==========================================================================
    // PREMIUM PRELOADER TRIGGER (SESSION SPECIFIC)
    // ==========================================================================
    let isPreloaderActive = false;

    // Check if preloader has already been displayed in the current session
    if (!sessionStorage.getItem("preloaderShown")) {
        isPreloaderActive = true;

        // Create preloader elements
        const preloader = document.createElement("div");
        preloader.id = "preloader";
        preloader.innerHTML = `
            <div class="preloader-content">
                <div class="preloader-logo">🌾</div>
                <h1 class="preloader-title">Traditional Rice Vijayashri</h1>
                <p class="preloader-subtitle">Preserving Tamil Nadu's Heritage Rice</p>
                <div class="preloader-line-container">
                    <div class="preloader-line"></div>
                </div>
            </div>
        `;
        document.body.prepend(preloader);

        // Lock scrolling on layout viewport
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";

        // Show preloader overlay
        gsap.to("body", { opacity: 1, duration: 0.3 });

        // Spawn golden floating grains/particles around the logo
        setTimeout(() => {
            const container = document.getElementById("preloader");
            if (container && window.gsap) {
                const logoEl = document.querySelector(".preloader-logo");
                if (logoEl) {
                    const rect = logoEl.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;

                    for (let i = 0; i < 22; i++) {
                        const particle = document.createElement("div");
                        particle.className = "preloader-particle";
                        container.appendChild(particle);

                        const angle = Math.random() * Math.PI * 2;
                        const distance = Math.random() * 40 + 25;

                        // Set initial random orbital points around the logo
                        gsap.set(particle, {
                            left: centerX,
                            top: centerY,
                            x: Math.cos(angle) * distance,
                            y: Math.sin(angle) * distance,
                            scale: Math.random() * 1.5 + 0.5,
                            opacity: Math.random() * 0.7 + 0.3
                        });

                        // Float upwards while fading out
                        gsap.to(particle, {
                            x: Math.cos(angle) * (distance + Math.random() * 50) + (Math.random() - 0.5) * 30,
                            y: Math.sin(angle) * (distance + Math.random() * 50) - (130 + Math.random() * 70),
                            opacity: 0,
                            scale: 0.2,
                            duration: Math.random() * 1.3 + 1.2,
                            ease: "power1.out"
                        });
                    }
                }
            }
        }, 80);

        // Fade out preloader and reveal homepage after 1.5s
        setTimeout(() => {
            gsap.to(preloader, {
                opacity: 0,
                duration: 0.5,
                ease: "power2.inOut",
                onComplete: () => {
                    preloader.remove();
                    // Restore standard scrolling
                    document.documentElement.style.overflow = "";
                    document.body.style.overflow = "";
                    sessionStorage.setItem("preloaderShown", "true");
                    isPreloaderActive = false;

                    // Play the Hero entrance timeline
                    if (window.heroTimeline) {
                        window.heroTimeline.play();
                    }
                }
            });
        }, 1500);
    } else {
        // Preloader already shown, fade in body content immediately
        gsap.to("body", { opacity: 1, duration: 0.5, ease: "power2.out" });
    }

    // ==========================================================================
    // SPLIT TEXT UTILITY FOR HEADINGS
    // ==========================================================================
    const splitHeading = (headingElement) => {
        const text = headingElement.textContent.trim();
        headingElement.innerHTML = '';
        
        const words = text.split(/\s+/);
        words.forEach((word, wordIdx) => {
            const wordSpan = document.createElement("span");
            wordSpan.className = "anim-word";
            
            const letters = Array.from(word);
            letters.forEach((char) => {
                const charSpan = document.createElement("span");
                charSpan.className = "anim-char";
                charSpan.textContent = char;
                wordSpan.appendChild(charSpan);
            });
            
            headingElement.appendChild(wordSpan);
            
            if (wordIdx < words.length - 1) {
                const spaceSpan = document.createElement("span");
                spaceSpan.className = "anim-space";
                spaceSpan.innerHTML = "&nbsp;";
                headingElement.appendChild(spaceSpan);
            }
        });
    };

    // ==========================================================================
    // ANIMATE SECTION TITLES & TITLES
    // ==========================================================================
    const headingsToAnimate = document.querySelectorAll("main h2, .page-title h1:not(.hero-content h1), .whatsapp-order h1, .about-text h2, .menu-title");
    headingsToAnimate.forEach(heading => {
        splitHeading(heading);
        
        gsap.fromTo(heading.querySelectorAll(".anim-char"),
            { opacity: 0, y: 15 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                stagger: 0.025,
                scrollTrigger: {
                    trigger: heading,
                    start: "top 88%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // ==========================================================================
    // HERO PARALLAX & LOAD ANIMATION
    // ==========================================================================
    if (document.querySelector(".hero")) {
        const heroTitle = document.querySelector(".hero-content h1");
        if (heroTitle) {
            splitHeading(heroTitle);
        }

        // Entrance timeline (paused only if preloader is active)
        const heroTl = gsap.timeline({ paused: isPreloaderActive });
        window.heroTimeline = heroTl;

        heroTl.fromTo(".hero-content", 
            { opacity: 0, y: 30 }, 
            { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
        )
        .fromTo(".hero-content h1 .anim-char", 
            { opacity: 0, y: 15 }, 
            { opacity: 1, y: 0, stagger: 0.02, duration: 0.7, ease: "power3.out" }, 
            "-=0.9"
        )
        .fromTo(".hero-content p", 
            { opacity: 0, y: 10 }, 
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 
            "-=0.5"
        )
        .fromTo(".hero-content .btn", 
            { opacity: 0, y: 15 }, 
            { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power3.out" }, 
            "-=0.5"
        );

        // Hero background load scaling & scroll parallax
        if (document.querySelector(".hero-bg-img")) {
            gsap.fromTo(".hero-bg-img",
                { scale: 1.25 },
                { scale: 1.1, duration: 2.5, ease: "power2.out" }
            );

            gsap.to(".hero-bg-img", {
                yPercent: 12,
                scale: 1.18,
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero",
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });
        }

        // Hero slow card float
        gsap.to(".hero-content", {
            y: -10,
            duration: 3,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1
        });
    }

    // ==========================================================================
    // STAGGERED GRIDS REVEALS
    // ==========================================================================
    const grids = document.querySelectorAll(".service-grid, .benefits-grid, .product-grid, .recipe-grid");
    grids.forEach(grid => {
        const cards = grid.children;
        if (cards.length > 0) {
            gsap.fromTo(cards, 
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    stagger: 0.12,
                    scrollTrigger: {
                        trigger: grid,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                }
            );
        }
    });

    // ==========================================================================
    // ANIMATED COUNTERS (SCROLL TRIGGERED)
    // ==========================================================================
    const counters = document.querySelectorAll(".counter");
    counters.forEach(counter => {
        const target = +counter.getAttribute("data-target");
        const countObj = { val: 0 };
        
        gsap.to(countObj, {
            val: target,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: counter,
                start: "top 88%",
                toggleActions: "play none none none"
            },
            onUpdate: () => {
                counter.innerText = Math.ceil(countObj.val);
            },
            onComplete: () => {
                if (target === 1000) {
                    counter.innerText = "1000+";
                } else if (target === 60) {
                    counter.innerText = "60+";
                } else if (target === 10) {
                    counter.innerText = "10+";
                } else {
                    counter.innerText = target + "+";
                }
            }
        });
    });

    // ==========================================================================
    // SOFT PAGE EXIT TRANSITIONS
    // ==========================================================================
    const localLinks = document.querySelectorAll("nav ul li a, .footer-col ul li a, .logo");
    localLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            const href = this.getAttribute("href");
            if (href && href.endsWith(".html") && !href.startsWith("http")) {
                e.preventDefault();
                gsap.to("body", {
                    opacity: 0,
                    duration: 0.4,
                    ease: "power2.inOut",
                    onComplete: () => {
                        window.location.href = href;
                    }
                });
            }
        });
    });

    // ==========================================================================
    // BUTTON CLICK RIPPLE TRIGGER
    // ==========================================================================
    const buttons = document.querySelectorAll(".btn");
    buttons.forEach(btn => {
        btn.addEventListener("click", function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement("span");
            ripple.className = "ripple-effect";
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // ==========================================================================
    // MOBILE NAVIGATION MENUS & SCROLL COMPACT
    // ==========================================================================
    const menuToggle = document.querySelector(".menu-toggle");
    const navUl = document.querySelector("nav ul");
    if (menuToggle && navUl) {
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("active");
            navUl.classList.toggle("active");
        });
        const navLinks = navUl.querySelectorAll("li a");
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                menuToggle.classList.remove("active");
                navUl.classList.remove("active");
            });
        });
        document.addEventListener("click", (e) => {
            if (!navUl.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove("active");
                navUl.classList.remove("active");
            }
        });
    }

    const nav = document.querySelector("nav");
    if (nav) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                nav.classList.add("scrolled");
            } else {
                nav.classList.remove("scrolled");
            }
        });
    }
});

// ==========================================================================
// WHATSAPP SUBMISSION HANDLER
// ==========================================================================
function sendWhatsApp() {
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const location = document.getElementById("location").value;
    const rice = document.getElementById("rice").value;
    const quantity = document.getElementById("quantity").value;
    const message = document.getElementById("message").value;

    const text = `🌾 Traditional Rice Vijayashri Order

Name : ${name}

Phone : ${phone}

Location : ${location}

Rice Variety : ${rice}

Quantity : ${quantity}

Additional Notes :
${message}`;

    const whatsappNumber = "918825668558";
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
}