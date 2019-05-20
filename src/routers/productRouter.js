const router = require('express').Router()
const conn = require('../connection/connection')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Upload images
const uploadDir = path.join(__dirname + '/../uploads/img' )
// console.log(__dirname);

const imgStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, uploadDir)
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
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

// Post product
router.post('/addproduct', (req, res) => {
    // const {product_name, category, description, price} = req.body
    const sql = `insert into products set ?`
    const sql2 = `select * from products`
    const data = req.body

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err.sqlMessage)

        conn.query(sql2, data, (err, result) => {
            if(err) return res.send(err.sqlMessage)

            res.send(result)
        })
    })
})

// Post brand
router.post('/addproduct/addbrand', (req, res) => {
    const sql = `insert into brands set ?`
    const sql2 = `select * from brands`
    const data = req.body

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err.sqlMessage)

        conn.query(sql2, data, (err, result) => {
            if(err) return res.send(err.sqlMessage)

            res.send(result)
        })
    })
})

// Post stock
router.post('/addproduct/addstock', (req, res) => {
    const sql = `insert into stocks set ?`
    const sql2 = `select * from stocks`
    const data = req.body

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err.sqlMessage)

        conn.query(sql2, data, (err, result) => {
            if(err) return res.send(err.sqlMessage)

            res.send(result)
        })
    })
})

// Get all products
router.get('/allproducts', (req, res) => {
    const sql = `select p.id, p.product_name, p.designer, p.category, p.description, sum(s.stock) as stock,                 p.price from products p
                 join stocks s on p.id = s.product_id
                 group by p.id, p.product_name, p.designer, p.category, p.description, p.price`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err.sqlMessage)

        res.send(result)
    })
})

// Delete product by id
router.delete('/deleteproducts/:productid', (req, res) => {
    const {productid} = req.params
    const sql = `delete from products where id = '${productid}'`
    const sql2 = `select p.id, p.product_name, b.brand_name, p.category, p.description, si.size, s.stock,                    p.price from products p
                  join brands b on p.id = b.product_id
                  join stocks s on p.id = s.product_id
                  join sizes si on s.size_id = si.id
                  order by b.brand_name`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err.sqlMessage)

        conn.query(sql2, (err, result) => {
            if(err) return res.send(err.sqlMessage)

            res.send(result)
        })
    })
})


module.exports = router