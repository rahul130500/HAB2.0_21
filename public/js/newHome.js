const info_sect = document.getElementById("home_info");
const home_container = document.getElementById("home_container");
const announcements = document.getElementById("announcements");
const old_ann = document.querySelector(".old_announce");
const toggle_btn = document.getElementById("toggle_view");

toggle_btn.addEventListener("click", (e) => {
  let txt = e.target.innerText;

  // toggling text
  if (txt === "+ See More") {
    toggle_btn.innerText = "+ See Less";
  } else if (txt === "+ See Less") {
    toggle_btn.innerText = "+ See More";
  }

  //toggling info section display
  if (info_sect.classList.contains("sm:w-7/12")) {
    info_sect.classList.remove("sm:w-7/12");
    info_sect.classList.add("hidden");
  } else if (
    !info_sect.classList.contains("sm:w-7/12") &&
    info_sect.classList.contains("hidden")
  ) {
    info_sect.classList.remove("hidden");
    info_sect.classList.add("sm:w-7/12");
  }

  // announcements section width toggle
  if (announcements.classList.contains("sm:w-5/12")) {
    announcements.classList.remove("sm:w-5/12");
  } else {
    announcements.classList.add("sm:w-5/12");
  }

  // overflow toggle
  if (
    old_ann.classList.contains("overflow-hidden") &&
    old_ann.classList.contains("max-h-60")
  ) {
    old_ann.classList.remove("overflow-hidden");
    old_ann.classList.remove("max-h-60");
    old_ann.classList.add("h-auto");
  } else if (old_ann.classList.contains("h-auto")) {
    old_ann.classList.remove("h-auto");
    old_ann.classList.add("overflow-hidden");
    old_ann.classList.add("max-h-60");
  }
});
