const btn = document.getElementById("btn")
const list = document.getElementById("list")
const message = document.getElementById("message")

const productInput = document.getElementById("product");
const priceInput = document.getElementById("price");
const descriptionInput = document.getElementById("description");

const URL = "http://localhost:3000/Products"


function validations() {

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
    
    )}




    function renderHTML (product,price,description) {

    let newElement = document.createElement ("li")

    let btnDelete = document.createElement ("button")

    btnDelete.textContent = "delete"
    newElement.innerHTML += `
    <br> Product: ${product} <br>  
    Price: ${price} <br> 
    Description: ${description}`

    btnDelete.addEventListener("click",() =>{
        newElement.remove()
        let products = JSON.parse(localStorage.getItem("products")) || [];

        products = products.filter(item =>
            item.product !== product ||
            item.price !== price ||
            item.description !== description
        );
        localStorage.setItem("products", JSON.stringify(products));
    })

    list.appendChild(newElement)
    newElement.appendChild(btnDelete)

}


const savedProducts = JSON.parse(localStorage.getItem("products")) || [];

savedProducts.forEach(item => {
    renderHTML(item.product, item.price, item.description);
});


validations()
 