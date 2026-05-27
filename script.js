/**
 * Variables declaration
 */


const btn = document.getElementById("btn")
const list = document.getElementById("list")
const message = document.getElementById("message")

const productInput = document.getElementById("product");
const priceInput = document.getElementById("price");
const descriptionInput = document.getElementById("description");

const URLAPI = "http://localhost:3000/products" //Url variable to store on the fake API

    document.addEventListener("DOMContentLoaded", ()=>{
        // Primero pinta lo guardado en localStorage
        const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
        savedProducts.forEach(item => {
            renderHTML(item.product, item.price, item.description);
        });

        // Luego trae lo de la API
        getProducts(URLAPI, list)
    }) //Function to make sure the shows after the DOM has loaded

/**
 * Added event to the button to make all the validations
 */
btn.addEventListener("click", (e) => {
        e.preventDefault()

        const product = productInput.value.trim();
        const price = priceInput.value.trim();
        const description = descriptionInput.value.trim();

        if (!product || !price || !description) {

            message.textContent = "Please complete all the fields";
            message.style.color = "red";
            return;
        }
         if (isNaN(Number(price))){
            message.textContent= "Please enter the right value"
            message.style.color = "red";
            
            return;
        }
            message.textContent = "product added successfully "
            message.style.color = "green"

            renderHTML (product,price,description)
            const productData = {
            product ,
            price,
            description
            };
            
             
    const products = JSON.parse(localStorage.getItem("products")) || [];
    products.push(productData);
    localStorage.setItem("products", JSON.stringify(products));
    
    productInput.value = "";
    priceInput.value = "";
    descriptionInput.value = "";
        }
    
    )

async function getProducts(Url, list) {
    try {
        const res = await axios.get(Url)
        const data = res.data
        for (const product of data) {
            renderHTML(product.product_name, product.product_price, product.description)
        }
    } catch (error) {
        console.error("Yaper eso no cargo", error)
        const errorMsg = document.createElement("li")
        errorMsg.textContent = "Error cargando los productos"
        list.appendChild(errorMsg)
    }
}
function renderHTML (product,price,description) {

    let newElement = document.createElement ("li")
    let btnDelete = document.createElement ("button")
    btnDelete.textContent = "delete"
    newElement.innerHTML += `
    <br> Product: ${product} <br>  
    Price: ${price} <br> 
    Description: ${description}`

    deleteData(newElement, btnDelete, product, price, description)

    list.appendChild(newElement)
    newElement.appendChild(btnDelete)
}
function deleteData (newElement, btnDelete, product, price, description){
    
    btnDelete.addEventListener("click", () =>{
        // Quita el elemento de la pantalla
        newElement.remove()

        // Lee los productos guardados
        let products = JSON.parse(localStorage.getItem("products")) || [];

        // Elimina SOLO la primera coincidencia exacta de los 3 campos
        const index = products.findIndex(item =>
            item.product === product &&
            item.price === price &&
            item.description === description
        );

        if (index !== -1) {
            products.splice(index, 1);
        }

        // Vuelve a guardar la lista actualizada
        localStorage.setItem("products", JSON.stringify(products));

        console.log("Product deleted");
    })
}


