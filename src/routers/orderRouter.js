const router = require('express').Router()
const conn = require('../connection/connection')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Retrieve orders for user
router.get('/order/:userid', (req, res) => {
    const sql = `select o.id, o.image, o.status, o.createdAt, o.price_total, o.payment_method, p.bank_name,                 p.iban, s.shipper_name, s.time_estimation from orders_user o
                 join payment p on o.bank_id = p.id
                 join shippers s on o.shipper_id = s.id
                 where o.user_id = ${req.params.userid} and o.status = 'waiting payment';`

    // console.log(req.params.userid);
    
    conn.query(sql, (err, result) => {
        if(err) return res.send(err.sqlMessage)

        res.send(result)
    })
})

// Retrieve all orders for admin
router.get('/allorders', (req, res) => {
    const sql = `select o.id, o.image, o.status, o.createdAt, o.price_total, o.payment_method, u.id as userid, 
                 u.username, u.email, p.bank_name, p.iban, s.shipper_name, s.time_estimation from orders_user o
                 join users u on o.user_id = u.id
                 join payment p on o.bank_id = p.id
                 join shippers s on o.shipper_id = s.id
                 order by o.status desc`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err.sqlMessage)

        res.send(result)
    })
})

// Retrieve order details for (user and admin)
    router.get('/orderdetail/:orderid', (req, res) => {
        const sql = `select id, status, createdAt from orders_user where id = ${req.params.orderid}`

        conn.query(sql, (err, result) => {
            if(err) return res.send(err.sqlMessage)

            res.send(result)
        })
    })

// Retrieve order detail (bank info)
    router.get('/bankdetail/:orderid', (req, res) => {
        const sql2 = `select o.payment_method, p.bank_name, p.iban from orders_user o
                      join payment p on p.id = o.bank_id
                      where o.id = ${req.params.orderid}`

            conn.query(sql2, (err, result) => {
            if(err) return res.send(err.sqlMessage)

            res.send(result)
        })
    })

// Retrieve order detail (shippers info)
    router.get('/shipperdetail/:orderid', (req, res) => {
        const sql3 = `select s.shipper_name, s.category, s.price, s.time_estimation from orders_user o
                      join shippers s on s.id = o.shipper_id
                      where o.id = ${req.params.orderid}`

            conn.query(sql3, (err, result) => {
                if(err) return res.send(err.sqlMessage)

                res.send(result)
        })
    })

    // Retrieve order details (address info)
    router.get('/addressdetail/:orderid', (req, res) => {
        const sql4 = `select a.first_name, a.last_name, a.street, a.city, a.province, a.country, a.postal_code,a.phone from addresses a
        join orders_user o on o.address_id = a.id
        where o.id = ${req.params.orderid}`

        conn.query(sql4, (err, result) => {
            if(err) return res.send(err.sqlMessage)

            res.send(result)
        })
    })

    // Retrieve order details (product)
    router.get('/product/:orderid', (req, res) => {
        const sql5 = `select pr.designer, pr.product_name, pr.category, pr.price, pr.image from products pr
        join order_details od on od.product_id = pr.id
        join orders_user o on od.order_id = o.id
        where o.id = ${req.params.orderid}`

        conn.query(sql5, (err, result) => {
            if(err) return res.send(err.sqlMessage)

            res.send(result)
        })
    })

    // Retrieve order details (price)
    router.get('/price/:orderid', (req, res) => {
        const sql6 = `select price_total as grandtotal from orders_user
        where id = ${req.params.orderid}`

        conn.query(sql6, (err, result) => {
            if(err) return res.send(err.sqlMessage)

            res.send(result)
        })
    })

    // Upload image proof
    const uploadDir = path.join(__dirname + '/../proof')

    const proofStorage = multer.diskStorage({
        destination: function(req, file, cb){
            cb(null, uploadDir)
        },
        filename: function(req, file, cb){
            cb(null, file.originalname)
        }
    })

    const upload = multer ({
        storage: proofStorage,
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

    router.post('/proof', upload.single('image'), (req, res) => {
        const sql = `update orders_user set image = '${req.file.filename}' where id = ${req.body.id}`

        conn.query(sql, (err, result) => {
            if(err) return res.send(err.sqlMessage)

            res.send(result)
        })
    })

    // Get avatar
    router.get('/proof/:photofile', (req, res) => {
    res.sendFile(`${uploadDir}/${req.params.photofile}`)
})


module.exports = router