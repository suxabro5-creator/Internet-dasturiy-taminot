const API = "https://fakestoreapi.com/products";
let products = [];
let currentId = null;
const productsDiv = document.getElementById("products");
const infoModal = new bootstrap.Modal(document.getElementById("infoModal"));
const editModal = new bootstrap.Modal(document.getElementById("editModal"));
async function getProducts() {
  const res = await fetch(API);
  products = await res.json();
  render();
}
function render() {
  productsDiv.innerHTML = "";
  products.forEach(p => {
    const col = document.createElement("div");
    col.className = "col-md-3 mb-3";
    const card = document.createElement("div");
    card.className = "card shadow-sm p-2";
    card.addEventListener("click", () => openInfo(p.id));
    card.innerHTML = `
      <img src="${p.image}" class="card-img-top" style="height:180px; object-fit:contain;">
      <div class="card-body">
        <h6>${p.title.substring(0, 40)}</h6>
        <p class="fw-bold">$${p.price}</p>

        <button class="btn btn-warning btn-sm edit-btn w-100 mb-1">Edit</button>
        <button class="btn btn-danger btn-sm delete-btn w-100">Delete</button>
      </div>
    `;
    card.querySelector(".edit-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      openEdit(p.id);
    });
    card.querySelector(".delete-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      deleteProduct(p.id);
    });
    col.appendChild(card);
    productsDiv.appendChild(col);
  });
}
async function openInfo(id) {
  const res = await fetch(`${API}/${id}`);
  const data = await res.json();
  document.getElementById("infoImage").src = data.image;
  document.getElementById("infoTitle").innerText = data.title;
  document.getElementById("infoPrice").innerText = "Price: $" + data.price;
  document.getElementById("infoCategory").innerText = "Category: " + data.category;
  document.getElementById("infoDesc").innerText = data.description;
  infoModal.show();
}
async function openEdit(id) {
  const res = await fetch(`${API}/${id}`);
  const data = await res.json();
  currentId = id;
  editTitle.value = data.title;
  editPrice.value = data.price;
  editImage.value = data.image;
  editModal.show();
}
async function saveUpdate() {
  const updated = {
    title: editTitle.value,
    price: editPrice.value,
    image: editImage.value
  };
  await fetch(`${API}/${currentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updated)
  });
  const index = products.findIndex(p => p.id === currentId);
  products[index] = { ...products[index], ...updated };
  render();
  editModal.hide();
}
async function deleteProduct(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE"
  });
  products = products.filter(p => p.id !== id);
  render();
}
async function addProduct() {
  const newProduct = {
    title: title.value,
    price: price.value,
    image: image.value,
    category: "custom"
  };

  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newProduct)
  });

  const data = await res.json();

  products.unshift(data);
  render();
}