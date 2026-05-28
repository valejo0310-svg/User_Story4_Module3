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
        getProducts(URLAPI)
    })

/**
 * Added event to the button to make all the validations
 */
btn.addEventListener("click", async (e) => {
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

          try {
        // POST a la API: ella le asigna un id
        const res = await axios.post(URLAPI, {
            product_name: product,
            product_price: price,
            description: description
        })

        message.textContent = "product added successfully"
        message.style.color = "green"

        // Renderiza usando el objeto que devolvió la API (ya con id)
        renderHTML(res.data)

        productInput.value = "";
        priceInput.value = "";
        descriptionInput.value = "";
    } catch (error) {
        console.error("No se pudo guardar", error)
        message.textContent = "Error guardando el producto"
        message.style.color = "red";
    }
})

async function getProducts(Url, list) {
    try {
        const res = await axios.get(Url)
        res.data.forEach(item => renderHTML(item))

    } catch (error) {
        console.error("Yaper eso no cargo", error)
        const errorMsg = document.createElement("li")
        errorMsg.textContent = "Error cargando los productos"
        list.appendChild(errorMsg)
    }
}
function renderHTML (item) {

    let newElement = document.createElement ("li")
    let btnDelete = document.createElement ("button")
    btnDelete.textContent = "delete"

    newElement.innerHTML = `
    <br> Product: ${item.product_name} <br>  
    Price: ${item.price_price} <br> 
    Description: ${item.description}`

    btnDelete.addEventListener("click", async () => {
        try {
            await axios.delete(`${URLAPI}/${item.id}`)
            newElement.remove()
            console.log("Product deleted")
        } catch (error) {
            console.error("No se pudo eliminar", error)
        }
    })

    newElement.appendChild(btnDelete)
    list.appendChild(newElement)
}



