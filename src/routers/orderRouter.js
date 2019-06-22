const router = require('express').Router()
const conn = require('../connection/connection')

// Retrieve orders for user
router.get('/order/:userid', (req, res) => {
    const sql = `select o.id, o.status, o.createdAt, o.price_total, o.payment_method, p.bank_name, p.iban,                  s.shipper_name, s.time_estimation from orders_user o
                 join payment p on o.bank_id = p.id
                 join shippers s on o.shipper_id = s.id
                 where o.user_id = ${req.params.userid} and o.status = 'waiting payment';`

    // console.log(req.params.userid);
    
    conn.query(sql, (err, result) => {
        if(err) return res.send(err.sqlMessage)

        res.send(result)
    })

    
})


module.exports = router