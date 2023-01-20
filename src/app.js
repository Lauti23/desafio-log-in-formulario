const express = require('express');
const handlebars = require('express-handlebars');
const cookieParser = require("cookie-parser")

const { configMySql, configSqlite3 } = require("./options/mysql.config")
const {createDatabase, createTable, createTableSqlite3 }= require('./controllers/middleware');
const DatabasesManager = require('./controllers/database.controller')
const ProductsManager = new DatabasesManager(configMySql, "products")
const MessagesManager = new DatabasesManager(configSqlite3, "messages")




const { Server } = require('socket.io')
const app = express()
const PORT = process.env.PORT || 8080;

app.engine('handlebars', handlebars.engine())
app.set('views', 'src/public/views')
app.set('view engine', 'handlebars')
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('./src/public')) 

const server = app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))
const io = new Server(server)


app.get('/', createDatabase, createTable, createTableSqlite3, async (req, res) => {
    res.render("index")
})

app.get('/login', (req, res) => {
    res.render("login")
})

app.post('/login', (req, res) => {
    
})

io.on('connection', (socket) => {
    console.log("Usuario conectado")
    const getData = async () => {
        let products = await ProductsManager.getAll()
        let chatHistory = await MessagesManager.getAll()
        socket.emit("productsData", products)
        socket.emit("chatHistoryData", chatHistory)
    }
    getData();

    const updateItems = async () => {
        let data = await ProductsManager.getAll()
        io.emit("productsData", data)
    }

    socket.on("createProduct", async (item) => {
        let id = await ProductsManager.insert(item)
        let product = await ProductsManager.getById(id)
        io.emit("newProduct", product)
        // console.log("newProduct:", product)
    })

    socket.on("createMessage", async (msg) => {
        let id = await MessagesManager.insert(msg)
        let message = await MessagesManager.getById(id)
        io.emit("newMessage", message)
    }) 

    socket.on("deleteProduct", async (id) => {
        await ProductsManager.delete(id)
        updateItems()
    })

    socket.on("updateProduct", async (id) => {
        let itemId = await ProductsManager.getById(id)
        socket.emit("updatedProduct", itemId)
    })

    socket.on("sendNewProduct", async (item) => {
        await ProductsManager.update(item)
        updateItems();
    })
})



app.post('/', (req, res) => {
    res.render("index", {products})
    console.log(products)
})