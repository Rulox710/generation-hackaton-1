/* Clave para el local storage */
const CART_KEY = "ritmo-cart";

const itemsElement = document.querySelector("#cart-items");
const summaryElement = document.querySelector("#cart-summary");
const subtotalElement = document.querySelector("#subtotal");
const totalElement = document.querySelector("#total");
const currency = new Intl.NumberFormat("es-MX", {
  style: "currency", currency: "MXN", maximumFractionDigits: 2
});

/**
 * Función que lee el localstorage y crea un arreglo con los elementos
 * encontrados
 * 
 * @return Un arreglo con los productos guardados
 */
function readCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(cart) ? cart : [];
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
  renderCart();
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function renderCart() {
  const cart = readCart();
  itemsElement.replaceChildren();

  if (cart.length === 0) {
    summaryElement.classList.add("d-none");
    const empty = makeElement("div", "text-center border py-5 px-3");
    empty.append(
      makeElement("h2", "h4 fw-bold", "Tu carrito está vacío"),
      makeElement("p", "text-secondary mb-4", "Explora los productos y agrega los que te interesen."),
    );
    const link = makeElement("a", "btn btn-dark", "Ver productos");
    link.href = "./index.html";
    empty.append(link);
    itemsElement.append(empty);
    return;
  }

  summaryElement.classList.remove("d-none");

  cart.forEach((item) => {
    const row = makeElement("article", "row align-items-center g-3 border-bottom py-3");
    const imageCol = makeElement("div", "col-auto");
    const image = makeElement("img", "cart-image");
    image.src = item.image;
    image.alt = item.imageAlt || item.name;
    image.onerror = () => image.remove();
    imageCol.append(image);

    const info = makeElement("div", "col");
    info.append(
      makeElement("div", "small text-secondary", item.category),
      makeElement("h2", "h6 fw-bold mb-1", item.name),
      makeElement("div", "fw-medium", currency.format(item.price))
    );

    const controls = makeElement("div", "col-6 col-md-auto d-flex align-items-center gap-2");
    const quantityLabel = makeElement("label", "visually-hidden", `Cantidad de ${item.name}`);
    const quantity = makeElement("input", "form-control form-control-sm quantity-control");
    quantity.type = "number";
    quantity.min = "1";
    quantity.max = "99";
    quantity.step = "1";
    quantity.value = String(item.quantity);
    quantity.setAttribute("aria-label", `Cantidad de ${item.name}`);
    quantity.addEventListener("change", () => {
      const nextQuantity = Math.max(1, Math.min(99, Number.parseInt(quantity.value, 10) || 1));
      const updated = readCart();
      const target = updated.find((product) => product.id === item.id);
      if (target) target.quantity = nextQuantity;
      saveCart(updated);
    });
    quantityLabel.append(quantity);
    controls.append(quantityLabel);

    const remove = makeElement("button", "btn btn-sm btn-outline-secondary", "Quitar");
    remove.type = "button";
    remove.addEventListener("click", () => saveCart(readCart().filter((product) => product.id !== item.id)));
    controls.append(remove);

    const lineTotal = makeElement("div", "col-6 col-md-2 text-end fw-bold", currency.format(item.price * item.quantity));
    row.append(imageCol, info, controls, lineTotal);
    itemsElement.append(row);
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  subtotalElement.textContent = currency.format(subtotal);
  totalElement.textContent = currency.format(subtotal);
}

document.querySelector("#clear-cart").addEventListener("click", () => saveCart([]));
document.querySelector("#checkout").addEventListener("click", () => {
  const modalElement = document.querySelector("#checkout-modal");
  bootstrap.Modal.getOrCreateInstance(modalElement).show();
});

renderCart();
