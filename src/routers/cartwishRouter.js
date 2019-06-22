const router = require('express').Router()
const conn = require('../connection/connection')

// Post wishlist
router.post('/wishlist/add', (req, res) => {
    const {userid, productid} = req.body
    const sql = `select * from cartwish where user_id = ${userid} and product_id = ${productid} and status = 'w'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err.sqlMessage)

        // Can't post same product to wishlist
        if(result.length) return res.send('Product is already added to wishlist')

        const sql2 = `insert into cartwish (user_id, product_id, status)
                      values (${userid}, ${productid}, 'w')`

        conn.query(sql2, (err, result) => {
        if(err) return res.send(err.sqlMessage)

        res.send(result)
        })
    })
})

// Get wishlist
router.get('/wishlist/:userid', (req, res) => {
    const {userid} = req.params
    const sql = `select w.id, w.user_id, w.product_id, w.qty, w.status, p.product_name, p.image, p.designer,                p.price from products p
                 join cartwish w on w.product_id = p.id
                 where w.user_id = ${userid} and w.status = 'w'`

    conn.query(sql, (err, result) => {
        if(err) res.send(err.sqlMessage)

        res.send(result)
    })
})

// Remove wishlist
router.delete('/wishlist/removewishlist/:id', (req, res) => {
    const sql = `delete from cartwish where id = ${req.params.id}`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err.sqlMessage)

        res.send(result)
    })
})

// Post cart
router.post('/cart/add', (req, res) => {
    const {userid, productid} = req.body
    const sql = `insert into cartwish (user_id, product_id, status)
    values (${userid}, ${productid}, 'c')`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err.sqlMessage)

        res.send(result)
    })
})

// Retrieve cart
router.get('/cart/:userid', (req, res) => {
    const {userid} = req.params
    const sql = `select w.id, w.user_id, w.product_id, w.qty, w.status, p.product_name, p.image, p.designer,                p.price from products p
                 join cartwish w on w.product_id = p.id
                 where w.user_id = ${userid} and w.status = 'c'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err.sqlMessage)

        res.send(result)
    })
})

// Add to wishlist from cart
router.post('/addtowishlist/:cartwishid', (req, res) => {
    const {cartwishid} = req.params
    const sql = `update cartwish set status = 'w' where id = ${cartwishid}`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err.sqlMessage)

        res.send(result)
    })
})





module.exports = router