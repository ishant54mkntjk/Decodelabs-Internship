
// Mobile Menu Toggle

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

// Close Menu After Clicking Link

const links = document.querySelectorAll(".nav-links a");

links.forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
    });
});


// Scroll To Top Button

const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", () => {

    if (window.scrollY > 300) {
        topBtn.style.display = "block";
    } else {
        topBtn.style.display = "none";
    }

});

topBtn.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


// Sticky Navbar Shadow

const header = document.querySelector("header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {
        header.style.boxShadow = "0 4px 15px rgba(0,0,0,.15)";
    } else {
        header.style.boxShadow = "0 2px 10px rgba(0,0,0,.08)";
    }

});

// Contact Form Validation


const form = document.getElementById("contactForm");

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const inputs = form.querySelectorAll("input, textarea");

    let valid = true;

    inputs.forEach(input => {

        if (input.value.trim() === "") {
            valid = false;
            input.style.border = "2px solid red";
        } else {
            input.style.border = "1px solid #ddd";
        }

    });

    if (valid) {
        alert("Message Sent Successfully!");
        form.reset();
    } else {
        alert("Please fill all fields.");
    }

});

// Button Hover Effect

const buttons = document.querySelectorAll(".btn");

buttons.forEach(button => {

    button.addEventListener("mouseenter", () => {
        button.style.transform = "scale(1.05)";
    });

    button.addEventListener("mouseleave", () => {
        button.style.transform = "scale(1)";
    });

});

// Fade In Animation on Scroll

const sections = document.querySelectorAll("section");

window.addEventListener("scroll", () => {

    sections.forEach(section => {

        const top = section.getBoundingClientRect().top;

        if (top < window.innerHeight - 100) {
            section.style.opacity = "1";
            section.style.transform = "translateY(0)";
        }

    });

});

sections.forEach(section => {
    section.style.opacity = "0";
    section.style.transform = "translateY(40px)";
    section.style.transition = "0.6s ease";
});