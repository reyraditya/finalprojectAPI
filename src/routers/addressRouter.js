const router = require('express').Router();
const conn = require('../connection/connection');


// Post new address
router.post('/addresses', (req, res) => {
    const sql = `INSERT INTO addresses SET ?`
    const data = req.body

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err)
        
        res.send(result)
    })
})

// Get address
router.get('/addresses/:userid', (req, res) => { // GET OWN TASKS BY USER ID
    const sql = `SELECT * FROM addresses WHERE user_id = ?`
    const data = req.params.userid

    conn.query(sql, data, (err, result) => {
        if (err) return res.send(err)

        res.send(result)
    })
})

// Delete existent address
router.delete('/addresses/:addressid', (req, res) => {
    const sql = `DELETE FROM addresses WHERE id = ?`
    const data = req.params.addressid

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

// Edit existent address
router.patch('/addresses/:addressid', (req, res) => {
    const sql = `UPDATE addresses SET ? WHERE id = ?`
    const data = [req.body, req.params.addressid]

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })

})





module.exports = router