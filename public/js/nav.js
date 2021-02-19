let el = document.querySelector(".tabs");
const listOfTabs = document.querySelectorAll(".tab a");
const profileCards = document.querySelectorAll(".profileCard");

document.addEventListener("DOMContentLoaded", (e) => {
  var instance = M.Tabs.init(el, {});
});

for (let i = 0; i < listOfTabs.length; i++) {
  listOfTabs[i].addEventListener("click", (e) => {
    const clickedTab = e.target.parentNode;
    clickedTab.classList.add("tabStyle");

    const tabs = e.target.parentNode.parentNode.children;
    for (let tab of tabs) {
      if (tab !== e.target.parentNode && tab.classList[0] !== "indicator")
        tab.classList.remove("tabStyle");
    }
  });
}
