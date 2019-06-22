const router = require('express').Router()
const conn = require('../connection/connection')

// Retrieve shipper
router.get('/shipper', (req, res) => {
    const sql = `select * from shippers`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err.sqlMessage)

        res.send(result)
    })
})

// Retrieve bank
router.get('/bank', (req, res) => {
    const sql = `select * from payment`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err.sqlMessage)

        res.send(result)
    })
})

// Place order
router.post('/placeorder', (req, res) => {
    const {
        user_id,
        address_id,
        bank_id,
        shipper_id,
        price_total,
        wishcart
    } = req.body
    const sql = `insert into orders_user set user_id = ${user_id}, address_id = ${address_id}, bank_id = ${bank_id}, shipper_id = ${shipper_id}, price_total = ${price_total}`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err.sqlMessage);

        const value = wishcart.map(obj => {
            return `(${result.insertId}, ${obj.product_id}, ${obj.price} )`
        })
        const sql2 = `insert into order_details (order_id, product_id, price) values ${value.join(",")}`

        conn.query(sql2, (err, result) => {
            if(err) return res.send(err.sqlMessage)

            const sql3 = `delete from cartwish where user_id = ${user_id} and status = 'c'`
            conn.query(sql3, (err, result) => {
                if(err) return res.send(err.sqlMessage)

                res.send(result)
            })
        })
    })
})

module.exports = router