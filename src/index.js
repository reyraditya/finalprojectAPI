const express = require('express');
const cors = require('cors')
const userRouter = require('./routers/userRouter.js');
const addressRouter = require('./routers/addressRouter');
const productRouter = require('./routers/productRouter');
const cartwishRouter = require('./routers/cartwishRouter');
const checkoutRouter = require('./routers/checkoutRouter');
const orderRouter = require('./routers/orderRouter');


const app = express()
const port = 1995

app.use(express.json())
app.use(cors())
app.use(userRouter)
app.use(addressRouter)
app.use(productRouter)
app.use(cartwishRouter)
app.use(checkoutRouter)
app.use(orderRouter)

app.listen(port, () => {
    console.log('running at port ' + port);
    
})