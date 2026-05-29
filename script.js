/**
 * Variables declaration
 */
const btn = document.getElementById("btn");
const list = document.getElementById("list");
const message = document.getElementById("message");

const productInput = document.getElementById("product");
const priceInput = document.getElementById("price");
const descriptionInput = document.getElementById("description");

const URLAPI = "http://localhost:3000/products";
const STORAGE_KEY = "products";

/**
 * LocalStorage helpers
 */
function saveProductsToLocalStorage(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function getProductsFromLocalStorage() {
    const products = localStorage.getItem(STORAGE_KEY);

    if (!products) {
        return [];
    }

    return JSON.parse(products);
}

function addProductToLocalStorage(product) {
    const products = getProductsFromLocalStorage();

    products.push(product);

    saveProductsToLocalStorage(products);
}

function deleteProductFromLocalStorage(id) {
    const products = getProductsFromLocalStorage();

    const filteredProducts = products.filter(product => product.id !== id);

    saveProductsToLocalStorage(filteredProducts);
}

/**
 * Load products when the page starts
 */
document.addEventListener("DOMContentLoaded", () => {
    getProducts(URLAPI);
});

/**
 * Added event to the button to make all the validations
 */
btn.addEventListener("click", async (e) => {
    e.preventDefault();

    const product = productInput.value.trim();
    const price = priceInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!product || !price || !description) {
        message.textContent = "Please complete all the fields";
        message.style.color = "red";
        return;
    }

    if (isNaN(Number(price))) {
        message.textContent = "Please enter the right value";
        message.style.color = "red";
        return;
    }

    try {
        const res = await axios.post(URLAPI, {
            product_name: product,
            product_price: price,
            description: description
        });

        message.textContent = "Product added successfully";
        message.style.color = "green";

        /**
         * Save new product in localStorage
         */
        addProductToLocalStorage(res.data);

        /**
         * Render the new product
         */
        renderHTML(res.data);

        productInput.value = "";
        priceInput.value = "";
        descriptionInput.value = "";

    } catch (error) {
        console.error("No se pudo guardar", error);

        message.textContent = "Error guardando el producto";
        message.style.color = "red";
    }
});

async function getProducts(url) {
    try {
        const res = await axios.get(url);

        /**
         * Clean list before rendering
         */
        list.innerHTML = "";

        /**
         * Save API products in localStorage
         */
        saveProductsToLocalStorage(res.data);

        /**
         * Render API products
         */
        res.data.forEach(item => renderHTML(item));

    } catch (error) {
        console.error("Yaper eso no cargo", error);

        /**
         * If API fails, load products from localStorage
         */
        const localProducts = getProductsFromLocalStorage();

        list.innerHTML = "";

        if (localProducts.length > 0) {
            localProducts.forEach(item => renderHTML(item));

            message.textContent = "Productos cargados desde localStorage";
            message.style.color = "orange";
        } else {
            const errorMsg = document.createElement("li");
            errorMsg.textContent = "Error cargando los productos";
            list.appendChild(errorMsg);
        }
    }
}

function renderHTML(item) {
    const newElement = document.createElement("li");
    const btnDelete = document.createElement("button");
    btnDelete.classList.add("btn","btn-outline-info","mt-2", "d-block")

    btnDelete.textContent = "delete";

    newElement.innerHTML = `
        <br> Product: ${item.product_name} <br>  
        Price: ${item.product_price} <br> 
        Description: ${item.description}
    `;

    btnDelete.addEventListener("click", async () => {
        try {
            await axios.delete(`${URLAPI}/${item.id}`);

            /**
             * Delete from localStorage
             */
            deleteProductFromLocalStorage(item.id);

            /**
             * Delete from HTML
             */
            newElement.remove();

            message.textContent = "Product deleted successfully";
            message.style.color = "green";

            console.log("Product deleted");

        } catch (error) {
            console.error("No se pudo eliminar", error);

            message.textContent = "Error eliminando el producto";
            message.style.color = "red";
        }
    });

    newElement.appendChild(btnDelete);
    list.appendChild(newElement);
}
