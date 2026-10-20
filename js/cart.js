/* Clave para el local storage */
const CART_KEY = "ritmo-cart";
/* Página del carrito */
const CART_LINK = "./buy.html";

/**
 * Función que lee el localstorage y crea un arreglo con los elementos
 * encontrados
 * 
 * @return Un arreglo con los productos guardados
 */
function readCart() {
  try {
    const value = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

/**
 * Función que guarda el carrito de compra en el local storage
 *
 * @param cart un JSON que tiene una lista conformada por elementos
 *        formados por los datos de un producto y la cantidad de este
 */
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

/**
 * Función que busca el número escrito en el carrito y lo actualiza
 * acorde a la cantidad de productos guardados en el carrito
 */
function updateCartCount() {
  const countElement = document.querySelector("#cart-count");
  if (!countElement) return;
  const count = readCart().reduce((sum, item) => sum + item.quantity, 0);
  countElement.textContent = String(count);
}

// Lista de productos. Una estructura de datos donde importa
const PRODUCTS = [{
  id: "hike-product-1",
  name: "The North Face",
  category: "Mochila",
  price: 1500,
  image: "./assets/images/1696322-500-580.png",
}, {
  id: "hike-product-2",
  name: "The North Face",
  category: "Chamarra",
  price: 3500,
  image: "./assets/images/1720464-500-580.png",
}, {
  id: "hike-product-3",
  name: "The North Face woman",
  category: "Chamarra",
  price: 2200,
  image: "./assets/images/1717414-500-580.png",
}, {
  id: "hike-product-4",
  name: "The North Face woman",
  category: "Chamarra",
  price: 4200,
  image: "./assets/images/1710130-500-580.png",
}, {
  id: "cycling-product-1",
  name: "Trek",
  category: "Camiseta",
  price: 650,
  image: "./assets/images/cycling-wear.webp",
}];

/**
 * Se agregan listener para eventos relacionados con todos los elementos
 * que sea "a" y su clase sea "product-card". Obtiene un identifivador
 * definido en el html y lo relaciona con un JSON usado como una base
 * de datos.
 * 
 * También tiene la lógica correspondiente a aumentar el carrito y
 * guardar en el local storage
 */
document.querySelectorAll("a.product-card").forEach((card) => {
  card.addEventListener("click", (event) => {
    event.preventDefault();

    const product = PRODUCTS.find(p => p.id === card.getAttribute("data-id"));
    if (!product.name || !product.price) {
      alert("No se pudo agregar este producto. Revisa su nombre y precio.");
      return;
    }

    const cart = readCart();
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);

    // Confirmación accesible y breve sin interrumpir la navegación.
    let status = document.querySelector("#cart-status");
    if (!status) {
      status = document.createElement("div");
      status.id = "cart-status";
      status.className = "visually-hidden";
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");
      document.body.append(status);
    }
    status.textContent = `${product.name} agregado al carrito.`;
  });
});

// Se asegura que el carrito esté contando bien en cuanto se recarga la
// página
updateCartCount();