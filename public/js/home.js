// Header Section

const slideContainer = document.querySelector(".container");
const slide = document.querySelector(".slides");
// const nextBtn = document.getElementById('next-btn');
// const prevBtn = document.getElementById('prev-btn');
const interval = 4000;

let slides = document.querySelectorAll(".slide");
let index = 1;
let slideId;

const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);

firstClone.id = "first-clone";
lastClone.id = "last-clone";

slide.append(firstClone);
slide.prepend(lastClone);

const slideWidth = slides[index].clientWidth;

slide.style.transform = `translateX(${-slideWidth * index}px)`;

console.log(slides);

const startSlide = () => {
  slideId = setInterval(() => {
    moveToNextSlide();
  }, interval);
};

const getSlides = () => document.querySelectorAll(".slide");

slide.addEventListener("transitionend", () => {
  slides = getSlides();
  if (slides[index].id === firstClone.id) {
    slide.style.transition = "none";
    index = 1;
    slide.style.transform = `translateX(${-slideWidth * index}px)`;
  }

  if (slides[index].id === lastClone.id) {
    slide.style.transition = "none";
    index = slides.length - 2;
    slide.style.transform = `translateX(${-slideWidth * index}px)`;
  }
});

const moveToNextSlide = () => {
  slides = getSlides();
  if (index >= slides.length - 1) return;
  index++;
  slide.style.transition = "2s ease-out";
  slide.style.transform = `translateX(${-slideWidth * index}px)`;
};

const moveToPreviousSlide = () => {
  if (index <= 0) return;
  index--;
  slide.style.transition = "2s ease-out";
  slide.style.transform = `translateX(${-slideWidth * index}px)`;
};

// slideContainer.addEventListener('mouseenter', () => {
//   clearInterval(slideId);
// });

slideContainer.addEventListener("mouseleave", startSlide);
// nextBtn.addEventListener('click', moveToNextSlide);
// prevBtn.addEventListener('click', moveToPreviousSlide);

startSlide();

// // on click function
function myFunction() {
  var btn = document.getElementById("myButton");
  var im1 = document.getElementById("slides1");
  // var im2 = document.getElementById("content_hab");
  // var bn = document.getElementById("bn");
  var scn = document.getElementById("sect");
  if (btn.innerHTML == "Large View") {
    // btn.value = "large";
    btn.innerHTML = "Small View";
    im1.style.height = "70%";
    // im2.style.width = "22%";
    // im2.style.bottom = "22%";
    // bn.style.bottom = "30%";
    scn.style.marginTop = "-170px";
  } else {
    // btn.value = "small";
    btn.innerHTML = "Large View";
    im1.style.height = "100%";
    // im2.style.width = "25%";
    // im2.style.bottom = "2%";
    // bn.style.bottom = "2%";
    scn.style.marginTop = "5px";
  }
}
