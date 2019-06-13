const router = require('express').Router()
const conn = require('../connection/connection')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Upload images
const uploadDir = path.join(__dirname + '/../productimages' )
// console.log(__dirname);

const imgStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, uploadDir)
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})

const upload = multer ({
    storage: imgStorage,
    limits: {
        fileSize: 10000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){ // will be error if the extension name is not one of these
            return cb(new Error('Please upload image file (jpg, jpeg, or png)')) 
        }
        cb(undefined, true)
    }
})

// Upload product images
router.post('/addproduct', upload.single('image'), (req, res) => {
    const {
        product_name,
        designer,
        gender,
        category,
        description,
        stock,
        price
    } = req.body
    const sql = `insert into products set product_name='${product_name}', designer='${designer}', gender='${gender}', category='${category}', description='${description}', image='${req.file.filename}', stock='${stock}', price='${price}'`
    // const sql2 = `set @product_id = (select max(id) from products)`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err.sqlMessage)
        
        res.send(result)

    })
})

// Get products images
router.get('/addproduct/addimages/:photofile', (req, res) => {
    res.sendFile(`${uploadDir}/${req.params.photofile}`)
})

// Retrieve all products
router.get('/allproducts', (req, res) => {
    const sql = `select p.id, p.product_name, p.designer, p.gender, p.category, p.description, p.image, p.stock as stock, p.price from products p`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err.sqlMessage)

        res.send(result)
    })
})

// Delete product by id
router.delete('/deleteproducts/:productid', (req, res) => {
    const {productid} = req.params
    const sql = `delete from products where id = '${productid}'`
    const sql2 = `select p.id, p.product_name, p.designer, p.category, p.description, p.stock,                               p.price from products p`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err.sqlMessage)

        conn.query(sql2, (err, result) => {
            if(err) return res.send(err.sqlMessage)

            res.send(result)
        })
    })
})


module.exports = router