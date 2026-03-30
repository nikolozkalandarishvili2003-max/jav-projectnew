const regBtn = document.querySelector("#regBtn");
const signInBtn = document.querySelector("#signInBtn");
const regForm = document.querySelector("#regForm");
const signInForm = document.querySelector("#signInForm");

// Sign In active by default
signInBtn.classList.add("activeTab");

regBtn.addEventListener("click", () => {
  regForm.classList.remove("hidden");
  signInForm.classList.add("hidden");
  regBtn.classList.add("activeTab");
  signInBtn.classList.remove("activeTab");
});
signInBtn.addEventListener("click", () => {
  regForm.classList.add("hidden");
  signInForm.classList.remove("hidden");
  signInBtn.classList.add("activeTab");
  regBtn.classList.remove("activeTab");
});

// Register
const regFirstName = document.querySelector("#regFirstName");
const regLastName = document.querySelector("#regLastName");
const regEmail = document.querySelector("#regEmail");
const regPassword = document.querySelector("#regPassword");
const regNumber = document.querySelector("#regNumber");
const regSubmit = document.querySelector("#regSubmit");

regSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  userRegister();
});

async function userRegister() {
  const regData = {
    phoneNumber: regNumber.value,
    password: regPassword.value,
    email: regEmail.value,
    firstName: regFirstName.value,
    lastName: regLastName.value,
    role: "user",
  };

  let resp = await fetch("https://rentcar.stepprojects.ge/api/Users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(regData),
  });

  if (!resp.ok) {
    let msg = await resp.text();
    alert(msg);
    return;
  }

  let data = await resp.json();
  console.log(data);
  regForm.reset();
}

// Sign In
const signInNumber = document.querySelector("#signInNumber");
const signInPassword = document.querySelector("#signInPassword");
const signInSubmit = document.querySelector("#signInSubmit");

signInSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  userSignIn();
});

async function userSignIn() {
  const signInData = {
    phoneNumber: signInNumber.value,
    password: signInPassword.value,
    email: "string",
    firstName: "string",
    lastName: "string",
    role: "user",
  };

  let resp = await fetch("https://rentcar.stepprojects.ge/api/Users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(signInData),
  });

  if (!resp.ok) {
    let msg = await resp.text();
    alert(msg);
    return;
  }

  let data = await resp.json();
  localStorage.setItem("token", data.token);
  signInForm.reset();
  location.reload();
}

// If already logged in
if (localStorage.getItem("token")) {
  regForm.classList.add("hidden");
  signInForm.classList.add("hidden");
  document.querySelector("#signInBtn").classList.add("hidden");
  document.querySelector("#regBtn").classList.add("hidden");

  const greet = document.createElement("h2");
  greet.textContent = "თქვენ შეხვედით სისტემაში";

  const logoutBtn = document.createElement("button");
  logoutBtn.textContent = "გამოსვლა";

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    location.reload();
  });

  document.querySelector(".secforlog").append(greet, logoutBtn);
}
