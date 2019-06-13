const express = require('express');
const cors = require('cors')
const userRouter = require('./routers/userRouter.js');
const addressRouter = require('./routers/addressRouter');
const productRouter = require('./routers/productRouter')


const app = express()
const port = 1995

app.use(express.json())
app.use(cors())
app.use(userRouter)
app.use(addressRouter)
app.use(productRouter)

app.listen(port, () => {
    console.log('running at port ' + port);
    
})