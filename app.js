const burgerbtn = document.querySelector("#burgerBtn");
const mobilenav = document.querySelector("#mobilenav");

burgerbtn.addEventListener("click", () => {
  mobilenav.classList.toggle("navOpen");
  burgerbtn.classList.toggle("activeBurger");
});
