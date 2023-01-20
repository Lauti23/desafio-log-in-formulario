const socket = io()

//DOM elements
let inputEmail = document.getElementById('inputEmail');
let chatBox = document.getElementById('chatBox');
let productsForm = document.getElementById('form')

const submitProducts = (e) => {
    e.preventDefault()
    let name = e.target[0].value;
    let price = e.target[1].value;
    let image = e.target[2].value;
    if(name && price && image) {
        let product = {name, price, image}
        console.log(product)
        socket.emit('createProduct', product)
        productsForm.reset()
    } else {
        document.getElementById('noData').innerHTML = "Faltan campos por completar..."
    }
}

const submitChat = (e) => {
    e.preventDefault()
    let message = e.target[0].value
    let email = inputEmail.value
    if(message && email) {
        let date = new Date().toLocaleString()
        let chat = {email, date, message}
        console.log(chat)
        socket.emit('createMessage', chat)
    } else {
        document.getElementById('noInfo').innerHTML = "Faltan campos por completar para enviar el mensaje..."
    }
}

chatBox.addEventListener('submit', (e) => submitChat(e))
productsForm.addEventListener('submit', (e) => submitProducts(e))

socket.on("productsData", data => {
    // console.log(data)
})

let table = document.getElementById('table')

socket.on('productsData', data => {
    // console.log("PRODUCTOS:", data)
    if(data.length === 0) {
        document.getElementById('table').innerHTML = `<p class= "noProds">No hay productos almacenados...</p>`
    } else {
        //DE ESTA FORMA IMPRIME LOS OBJETOS DE A UNO PERO CUANDO REFRESCO SOLO QUEDA IMPRESO EL ULTIMO OBJETO DEL ARRAY DATA.//////////////////////
        // let table = document.getElementById('table')
        // let product = data[data.length - 1]
        // let tableRow = document.createElement('tr')
        // tableRow.innerHTML = `<td class= "td">${product.productName}</td>
        //                     <td class= "td">${product.productPrice}</td>
        //                     <td class= "td"><img src=${product.productImage}></td>`
        // table.append(tableRow)

        //DE ESTA FORMA ME IMPRIME EL ARRAY COMPLETO CADA VEZ QUE AGREGO UN PRODUCTO PERO CUANDO REFRESCO QUEDA IMPRESO TODO EL ARRAY SIN REPETIDOS./////
        data.forEach(prod => {
        let tableRow = document.createElement('tr')
        tableRow.innerHTML = `<td class= "td">${prod.name}</td>
                            <td class= "td">${prod.price}</td>
                            <td class= "td"><img class="prodImage" src=${prod.image}></td>
                            <td class="td"><button id="deleteProdBtn" class="${prod.id}">X</button></td>`
        table.appendChild(tableRow)
    })   
    }  
}) 

socket.on("newProduct", data => {
    // console.log("Nuevo producto:", data)
    let product = data[data.length - 1]
    let tableRow = document.createElement('tr')
    tableRow.innerHTML = `<td class="td">${product.name}</td>
                        <td class="td">${product.price}</td>
                        <td class="td"><img class="prodImage" src=${product.image}></td>
                        <td class="td"><button id="deleteProdBtn" class="${product.id}">X</button></td>`
    table.append(tableRow)
})

//FUNCIÓN PARA ENVIAR A EL SERVIDOR EL ID DEL PRODUCTO A ELIMINAR
const deleteItem = (e) => {
    if(e.target.nodeName == "BUTTON") {
        let buttonClicked = e.target
        let itemId = buttonClicked.className
        socket.emit("deleteProduct", itemId)
        // console.log("Id enviado", itemId)
    }
}

table.addEventListener("click", (e) => deleteItem(e))

socket.on("chatHistoryData", data => {
    // console.log(data)
    let messages = "";
    data.forEach(text => {
        messages += `<p><span class= "email"> ${text.email}</span><span class= "date">[${text.date}]</span><span class= "message">: ${text.message}</span></p>`
    })
    document.getElementById('chatLogs').innerHTML = messages
    document.getElementById('message').value = ""
})

socket.on('newMessage', data => {
    // console.log("newMessage", data)
    let message = data[data.length - 1]
    let chatLog = document.getElementById("chatLogs")
    let chat = document.createElement("p")
    chat.innerHTML = `<span class="email">${message.email}</span><span class="date">[${message.date}]:</span><span class="message"> ${message.message}</span>`
    chatLog.append(chat)
    // let messages = "";
    // data.forEach(text => {
    //     messages += `<p><span class= "email"> ${text.email}</span><span class= "date">[${text.date}]</span><span class= "message">: ${text.message}</span></p>`
    // })
    // document.getElementById('chatLogs').innerHTML = messages
    // document.getElementById('message').value = ""
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////         LOGICA PARA EL LOGIN                //////////////////////////////////////////

let formLogin = document.getElementById("formLogin")

const submitLogin = (e) => {
    e.preventDefault()
    console.log(e.target)
}

formLogin.addEventListener("submit", (e) => submitLogin(e))


