// ========================================
// SHAKE&GO - Sistema de Carrito de Compras
// ========================================

// Inicializar carrito desde localStorage o crear uno vacío
let cart = JSON.parse(localStorage.getItem("shakegoCart")) || []

// Actualizar UI al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  updateCartUI()
})

// Función para añadir producto al carrito
function addToCart(id, name, price, image) {
  // Buscar si el producto ya existe en el carrito
  const existingItem = cart.find((item) => item.id === id)

  if (existingItem) {
    // Si existe, incrementar cantidad
    existingItem.quantity += 1
  } else {
    // Si no existe, añadir nuevo item
    cart.push({
      id: id,
      name: name,
      price: price,
      image: image,
      quantity: 1,
    })
  }

  // Guardar en localStorage
  saveCart()

  // Actualizar UI
  updateCartUI()

  // Mostrar notificación
  showToast(`${name} añadido al carrito`, "success")

  // Abrir carrito brevemente para mostrar el producto añadido
  openCartBriefly()
}

// Función para eliminar producto del carrito
function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id)
  saveCart()
  updateCartUI()
  showToast("Producto eliminado", "")
}

// Función para actualizar cantidad
function updateQuantity(id, change) {
  const item = cart.find((item) => item.id === id)

  if (item) {
    item.quantity += change

    if (item.quantity <= 0) {
      removeFromCart(id)
    } else {
      saveCart()
      updateCartUI()
    }
  }
}

// Función para guardar carrito en localStorage
function saveCart() {
  localStorage.setItem("shakegoCart", JSON.stringify(cart))
}

// Función para actualizar la UI del carrito
function updateCartUI() {
  const cartContent = document.getElementById("cart-content")
  const cartCount = document.getElementById("cart-count")
  const cartTotal = document.getElementById("cart-total")

  if (!cartContent || !cartCount || !cartTotal) return

  // Calcular total de items
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  cartCount.textContent = totalItems

  // Calcular precio total
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  cartTotal.textContent = totalPrice.toFixed(2).replace(".", ",") + "€"

  // Renderizar contenido del carrito
  if (cart.length === 0) {
    cartContent.innerHTML = `
            <div class="cart-empty">
                <span>🛍️</span>
                <p>Tu carrito está vacío</p>
            </div>
        `
  } else {
    cartContent.innerHTML = cart
      .map(
        (item) => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-price">${item.price.toFixed(2).replace(".", ",")}€</p>
                    <div class="cart-item-controls">
                        <button onclick="updateQuantity('${item.id}', -1)">−</button>
                        <span class="cart-item-quantity">${item.quantity}</span>
                        <button onclick="updateQuantity('${item.id}', 1)">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" title="Eliminar">🗑️</button>
            </div>
        `,
      )
      .join("")
  }
}

// Función para abrir/cerrar el carrito
function toggleCart() {
  const cartPanel = document.getElementById("cart-panel")
  const cartOverlay = document.getElementById("cart-overlay")

  if (cartPanel && cartOverlay) {
    cartPanel.classList.toggle("active")
    cartOverlay.classList.toggle("active")

    // Prevenir scroll del body cuando el carrito está abierto
    document.body.style.overflow = cartPanel.classList.contains("active") ? "hidden" : ""
  }
}

// Función para abrir el carrito brevemente
function openCartBriefly() {
  const cartPanel = document.getElementById("cart-panel")
  const cartOverlay = document.getElementById("cart-overlay")

  if (cartPanel && cartOverlay) {
    cartPanel.classList.add("active")
    cartOverlay.classList.add("active")

    // Cerrar después de 2 segundos
    setTimeout(() => {
      cartPanel.classList.remove("active")
      cartOverlay.classList.remove("active")
    }, 2000)
  }
}

// Función para mostrar notificación toast
function showToast(message, type = "") {
  const toast = document.getElementById("toast")

  if (toast) {
    toast.textContent = message
    toast.className = "toast show" + (type ? " " + type : "")

    // Ocultar después de 3 segundos
    setTimeout(() => {
      toast.classList.remove("show")
    }, 3000)
  }
}

// Función de checkout
function checkout() {
  if (cart.length === 0) {
    showToast("Tu carrito está vacío", "")
    return
  }

  // Aquí iría la lógica de checkout real
  showToast("¡Redirigiendo al checkout!", "success")

  // Simular redirección
  setTimeout(() => {
    alert("Esta funcionalidad estaría conectada a una pasarela de pago como Stripe.")
  }, 1000)
}

// Cerrar carrito con tecla Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const cartPanel = document.getElementById("cart-panel")
    if (cartPanel && cartPanel.classList.contains("active")) {
      toggleCart()
    }
  }
})
