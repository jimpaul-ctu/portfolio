document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Footer Year ---------- */
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* ---------- Typing Effect ---------- */
  /* ---------- Typing Effect ---------- */
const typedName = document.getElementById("typedName");

const name = "Paul";
let nameIndex = 0;

function typeName() {
  if (!typedName) return;

  if (nameIndex < name.length) {
    typedName.textContent += name.charAt(nameIndex);
    nameIndex++;
    setTimeout(typeName, 150);
  }
}

if (typedName) {
  typeName();
}
  /* ---------- Contact Form with EmailJS ---------- */
  const contactForm = document.getElementById("contactForm");
  const contactStatus = document.getElementById("formStatus");
  const submitButton = document.getElementById("submitButton");
  const contactSection = document.getElementById("contact");

  const EMAILJS_PUBLIC_KEY = "x9dhzR41y1Wx1zePA";
  const EMAILJS_SERVICE_ID = "service_yhlix4r";
  const EMAILJS_TEMPLATE_ID = "template_joqcfxq";
  const RECIPIENT_EMAIL = "orchestratorweb@gmail.com";

  function showFormStatus(message, type) {
    if (!contactStatus) return;

    contactStatus.textContent = message;
    contactStatus.classList.remove("d-none", "status-success", "status-error");

    if (type === "success") {
      contactStatus.classList.add("status-success");
    } else if (type === "error") {
      contactStatus.classList.add("status-error");
    }
  }

  function scrollToContactSection() {
    if (!contactSection) return;

    contactSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  if (contactForm && typeof emailjs !== "undefined") {
    emailjs.init({
      publicKey: EMAILJS_PUBLIC_KEY
    });

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.classList.add("was-validated");
        return;
      }

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const subject = document.getElementById("subject").value.trim();
      const message = document.getElementById("message").value.trim();

      const templateParams = {
        from_name: name,
        from_email: email,
        subject: subject,
        message: message,
        to_email: RECIPIENT_EMAIL
      };

      const originalButtonText = submitButton.innerHTML;

      submitButton.disabled = true;
      submitButton.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Sending...
      `;

      showFormStatus("Sending your message...", "info");

      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams
        );

        showFormStatus(
          "Message sent successfully! I will get back to you soon.",
          "success"
        );

        contactForm.reset();
        contactForm.classList.remove("was-validated");

        scrollToContactSection();
      } catch (error) {
        console.error("EmailJS error:", error);

        showFormStatus(
          "Sorry, something went wrong. Please try again or email me directly.",
          "error"
        );

        scrollToContactSection();
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      }
    });
  } else if (contactForm) {
    console.warn(
      "EmailJS is not loaded. Make sure the EmailJS script is included before script.js."
    );
  }

  /* ---------- Newsletter Form ---------- */
  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterStatus = document.getElementById("newsletterStatus");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!newsletterForm.checkValidity()) {
        newsletterForm.classList.add("was-validated");
        return;
      }

      newsletterStatus.textContent = "Thank you for subscribing!";
      newsletterForm.reset();
      newsletterForm.classList.remove("was-validated");
    });
  }

  /* ---------- Navbar Scroll Effect ---------- */
  const navbar = document.querySelector(".glass-nav");

  function handleNavbarScroll() {
    if (!navbar) return;

    if (window.scrollY > 20) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleNavbarScroll);
  handleNavbarScroll();

  /* ---------- Projects Swipe Carousel ---------- */
  const projectsCarousel = document.getElementById("projectsCarousel");
  const projectsTrack = document.getElementById("projectsTrack");
  const prevButton = document.querySelector(".prev-btn");
  const nextButton = document.querySelector(".next-btn");
  const carouselDots = document.getElementById("carouselDots");

  if (projectsCarousel && projectsTrack) {
    const projectCards = projectsTrack.querySelectorAll(".project-card");
    let currentIndex = 0;
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let startTranslate = 0;

    function getCardsPerView() {
      if (window.innerWidth <= 575.98) return 1;
      if (window.innerWidth <= 991.98) return 2;
      return 3;
    }

    function getMaxIndex() {
      return Math.max(0, projectCards.length - getCardsPerView());
    }

    function createDots() {
      if (!carouselDots) return;

      carouselDots.innerHTML = "";

      for (let i = 0; i <= getMaxIndex(); i++) {
        const dot = document.createElement("button");
        dot.className = "carousel-dot";
        dot.setAttribute("aria-label", `Go to project ${i + 1}`);

        dot.addEventListener("click", () => {
          currentIndex = i;
          updateCarousel();
        });

        carouselDots.appendChild(dot);
      }

      updateDots();
    }

    function updateDots() {
      if (!carouselDots) return;

      const dots = carouselDots.querySelectorAll(".carousel-dot");

      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
      });
    }

    function updateCarousel() {
      if (!projectCards.length) return;

      const card = projectCards[0];
      const gap = 24;
      const cardWidth = card.offsetWidth + gap;
      const maxIndex = getMaxIndex();

      currentIndex = Math.min(currentIndex, maxIndex);

      currentTranslate = -currentIndex * cardWidth;
      projectsTrack.style.transform = `translateX(${currentTranslate}px)`;

      updateDots();
    }

    prevButton?.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });

    nextButton?.addEventListener("click", () => {
      if (currentIndex < getMaxIndex()) {
        currentIndex++;
        updateCarousel();
      }
    });

    function dragStart(event) {
      isDragging = true;
      projectsCarousel.classList.add("dragging");
      projectsTrack.classList.add("no-transition");

      startX = event.type.includes("touch")
        ? event.touches[0].clientX
        : event.clientX;

      startTranslate = currentTranslate;
    }

    function dragMove(event) {
      if (!isDragging) return;

      const clientX = event.type.includes("touch")
        ? event.touches[0].clientX
        : event.clientX;

      const difference = clientX - startX;

      projectsTrack.style.transform = `translateX(${startTranslate + difference}px)`;
    }

    function dragEnd(event) {
      if (!isDragging) return;

      isDragging = false;
      projectsCarousel.classList.remove("dragging");
      projectsTrack.classList.remove("no-transition");

      const clientX = event.type.includes("touch")
        ? event.changedTouches[0].clientX
        : event.clientX;

      const difference = clientX - startX;
      const card = projectCards[0];
      const cardWidth = card.offsetWidth + 24;

      if (difference < -60 && currentIndex < getMaxIndex()) {
        currentIndex++;
      } else if (difference > 60 && currentIndex > 0) {
        currentIndex--;
      }

      currentTranslate = -currentIndex * cardWidth;
      projectsTrack.style.transform = `translateX(${currentTranslate}px)`;

      updateDots();
    }

    projectsCarousel.addEventListener("mousedown", dragStart);
    window.addEventListener("mousemove", dragMove);
    window.addEventListener("mouseup", dragEnd);

    projectsCarousel.addEventListener("touchstart", dragStart, { passive: true });
    projectsCarousel.addEventListener("touchmove", dragMove, { passive: true });
    projectsCarousel.addEventListener("touchend", dragEnd);

    window.addEventListener("resize", () => {
      createDots();
      updateCarousel();
    });

    createDots();
    updateCarousel();
  }
});
/* ---------- Show More Projects ---------- */
const showMoreButton = document.getElementById("showMoreButton");
const moreProjects = document.getElementById("moreProjects");

if (showMoreButton && moreProjects) {
  const showMoreText = showMoreButton.querySelector(".button-text");

  moreProjects.addEventListener("shown.bs.collapse", () => {
    showMoreText.innerHTML =
      '<i class="bi bi-dash-circle me-2"></i> Show Less Projects';
    showMoreButton.setAttribute("aria-expanded", "true");
  });

  moreProjects.addEventListener("hidden.bs.collapse", () => {
    showMoreText.innerHTML =
      '<i class="bi bi-plus-circle me-2"></i> Show More Projects';
    showMoreButton.setAttribute("aria-expanded", "false");
  });
}
/* ---------- Scroll to Top Button ---------- */
const scrollToTopButton = document.getElementById("scrollToTop");

function handleScrollToTopButton() {
  if (!scrollToTopButton) return;

  if (window.scrollY > 350) {
    scrollToTopButton.classList.add("show");
  } else {
    scrollToTopButton.classList.remove("show");
  }
}

if (scrollToTopButton) {
  scrollToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  window.addEventListener("scroll", handleScrollToTopButton);
  handleScrollToTopButton();
}