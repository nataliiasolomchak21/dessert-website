// Empty array to hold products
const cart = [];

// Add to Cart buttons
document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
  button.addEventListener("click", (event) => {
    const card = event.target.closest(".card");
    const name = card.querySelector(".card-title").innerText;
    const price = parseFloat(
      card.querySelector(".card-text").innerText.replace("$", "")
    );
    addItemToCart(name, price);
  });
});

// Add To Cart logic
function addItemToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    if (existingItem.quantity < 8) {
      existingItem.quantity += 1;
    } else {
      alert("Maximum quantity of 8 reached for this item");
    }
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  renderCart();

  // Save to localStorage
  saveCartToStorage();
}

// Remove item from the cart
function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
  saveCartToStorage();
}

// Render an HTML cart
function renderCart() {
  const emptyMessage = document.getElementById("cart-empty");
  const cartContainer = document.getElementById("cart");

  if (cart.length === 0) {
    emptyMessage.style.display = "flex";
    cartContainer.style.display = "none";
    cartContainer.innerHTML = "";
    return;
  }

  emptyMessage.style.display = "none";
  cartContainer.style.display = "block";

  let html = `<div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">Cart</h4>
          </div>`;

  cart.forEach((item, index) => {
    html += `<div class="product-card p-3 shadow-sm mb-3">
            <div class="row align-items-center justify-content-between">
              <div class="col-md-6">
                <h6 class="mb-1">${item.name}</h6>
              </div>
              <div class="col-md-3 d-flex align-items-center">
                <button class="quantity-btn" aria-label="Decrement" onclick="updateQuantity(${index}, -1)">-</button>
                <input type="number" class="quantity-input mx-1" value="${item.quantity
      }" min="1" readonly>
                <button class="quantity-btn" aria-label="Increment" onclick="updateQuantity(${index}, 1)">+</button>
              </div>
              <div class="col-md-2">
                <span class="fw-bold">${(item.price * item.quantity).toFixed(
        2
      )}</span>
              </div>
              <div class="col-md-1">
                <i class="bi bi-trash remove-btn" onclick="removeItem(${index})"></i>
              </div>
            </div>
          </div>`;
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  html += `<div class="summary-card p-4 shadow-sm">
            <h5 class="mb-4">Order Total</h5>
            <div class="d-flex justify-content-between mb-4">
              <span class="fw-bold">Total</span>
              <span class="fw-bold">$${total.toFixed(2)}</span>
            </div>
            <button class="btn btn-primary checkout-btn w-100 mb-3" aria-label="Confirm order" id="confirm-order">Confirm Order</button>
          </div>`;

  cartContainer.innerHTML = html;

  // Add toaster confirmation
  document.getElementById("confirm-order").addEventListener("click", () => {
    const toastElement = document.querySelector(".toast");
    const toast = new bootstrap.Toast(toastElement);
    toast.show();

    // Clear the cart
    cart.length = 0;
    localStorage.removeItem('cart');
    renderCart();
  });
}

// Update quantity functionality
function updateQuantity(index, change) {
  // Get the cart item by its index
  const item = cart[index];
  if (!item) return;

  // Calculate new quantity
  const newQuanitity = item.quantity + change;

  // Prevent going below 1
  if (newQuanitity < 1 || newQuanitity > 8) return;

  // Update quantity
  item.quantity = newQuanitity;

  renderCart();
  saveCartToStorage();
}

// Save to local storage
function saveCartToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart))
}

// Load cart from storage 
function loadCartFromStorage() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    try {
      const parsed = JSON.parse(savedCart);
      if (Array.isArray(parsed)) {
        cart.splice(0, cart.length, ...parsed)
      }
    } catch (error) {
      console.error('Failed to load cart from storage', e)
    }
  }
}

loadCartFromStorage();
renderCart();
