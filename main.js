const cards = document.querySelector("#cards");

if (cards) {
  fetch("https://restaurant.stepprojects.ge/api/Products/GetAll")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((product) => {
        const card = document.createElement("div");
        card.classList.add("card");

        const food = document.createElement("div");
        food.classList.add("food");

        food.innerHTML = `
          <img src="${product.image}" height="200" width="200">
          <h3>${product.name}</h3>
          <p>ფასი: $${product.price}</p>
          <p>თხილი: ${product.nuts ? "✅" : "❌"}</p>
          <button class="addToCart" 
            data-id="${product.id}"
            data-name="${product.name}"
            data-price="${product.price}"
            data-image="${product.image}">🛒 კალათაში</button>
        `;
        card.appendChild(food);
        cards.appendChild(card);
      });
    });
}

const cartBtn = document.querySelector("#cartBtn");
const mobileCartTrigger = document.querySelector(".cartTrigger");

function showCart() {
  document.querySelector(".productsSection").classList.add("hidden");
  document.querySelector(".cartSection").classList.remove("hidden");
  fetchCart();
}

if (cartBtn) {
  cartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showCart();
  });
}

if (mobileCartTrigger) {
  mobileCartTrigger.addEventListener("click", (e) => {
    e.preventDefault();
    showCart();
  });
}

function fetchCart() {
  const cartItemsMain = document.querySelector(".cartItemsMain");
  cartItemsMain.innerHTML = "";
  fetch("https://restaurant.stepprojects.ge/api/Baskets/GetAll")
    .then((resp) => resp.json())
    .then((data) => {
      data.forEach((item) => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cartItem");

        const cartItemName = document.createElement("div");
        cartItemName.classList.add("cartItemName");
        const cartImage = document.createElement("img");
        cartImage.src = item.product.image;
        const cartName = document.createElement("h3");
        cartName.textContent = item.product.name;
        cartItemName.append(cartImage, cartName);

        const qty = document.createElement("div");
        qty.classList.add("qty");
        qty.textContent = item.quantity;

        const qtyMinus = document.createElement("button");
        qtyMinus.textContent = "-";
        const qtyPlus = document.createElement("button");
        qtyPlus.textContent = "+";
        qty.prepend(qtyMinus);
        qty.append(qtyPlus);

        const price = document.createElement("span");
        price.classList.add("price");
        price.textContent = item.product.price;

        const total = document.createElement("span");
        total.classList.add("total");
        total.textContent = item.quantity * item.product.price;

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("deleteBtn");
        deleteBtn.textContent = "X";

        cartItem.append(cartItemName, qty, price, total, deleteBtn);

        deleteBtn.addEventListener("click", () =>
          productDelete(item.product.id),
        );
        qtyMinus.addEventListener("click", () =>
          updateQuantity(
            item.quantity - 1,
            item.product.price,
            item.product.id,
          ),
        );
        qtyPlus.addEventListener("click", () =>
          updateQuantity(
            item.quantity + 1,
            item.product.price,
            item.product.id,
          ),
        );

        cartItemsMain.appendChild(cartItem);
      });

      let allTotal = 0;
      data.reduce((acc, item) => {
        allTotal = acc + item.quantity * item.product.price;
        return allTotal;
      }, 0);

      document.querySelector(".allTotalPrice").textContent = "$" + allTotal;
    });
}

function productDelete(id) {
  fetch(`https://restaurant.stepprojects.ge/api/Baskets/DeleteProduct/${id}`, {
    method: "DELETE",
  }).then(() => fetchCart());
}

function updateQuantity(quantity, price, productId) {
  if (quantity < 1) return;

  const reqBodyObj = {
    quantity: quantity,
    price: price,
    productId: productId,
  };

  fetch("https://restaurant.stepprojects.ge/api/Baskets/UpdateBasket", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reqBodyObj),
  }).then(() => fetchCart());
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("addToCart")) {
    const id = e.target.dataset.id;
    const price = e.target.dataset.price;
    addingToCart(1, price, id);
  }
});

const toCheckOut = document.querySelector("#toCheckOut");
const checkoutForm = document.querySelector("#checkoutForm");

if (toCheckOut) {
  toCheckOut.addEventListener("click", () => {
    checkoutForm.classList.remove("hidden");
    toCheckOut.classList.add("hidden");
    checkoutForm.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

if (checkoutForm) {
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    checkoutForm.classList.add("hidden");
    toCheckOut.classList.remove("hidden");
    checkoutForm.reset();
    showToast("✅ შეკვეთა წარმატებით განხორციელდა!");
    setTimeout(() => {
      document.querySelector(".cartSection").classList.add("hidden");
      document.querySelector(".productsSection").classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 2000);
  });
}

function addingToCart(qty, price, id) {
  const reqBodyObj = {
    quantity: qty,
    price: price,
    productId: id,
  };

  fetch("https://restaurant.stepprojects.ge/api/Baskets/AddToBasket", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reqBodyObj),
  })
    .then((resp) => resp.json())
    .then(() => showToast("🛒 პროდუქტი კალათში დაემატა!"));
}

function showToast(msg) {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.textContent = msg;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add("toastVisible"));
  });

  setTimeout(() => {
    toast.classList.remove("toastVisible");
    toast.addEventListener("transitionend", () => toast.remove());
  }, 2500);
}
