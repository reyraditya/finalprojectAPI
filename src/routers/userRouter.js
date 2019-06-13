const router = require('express').Router();
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const conn = require('../connection/connection.js')
const {sendVerify} = require ('../email/nodemailer')
const multer = require('multer')
const path = require('path')
const fs = require('fs')


// Register new user
router.post('/users', async (req, res) => {
    var sql = `INSERT INTO users SET ?`
    var sql2 = `SELECT * FROM users`
    var data  = req.body

    if(!isEmail(req.body.email)) return res.send("Email is invalid")

    req.body.password = await bcrypt.hash(req.body.password, 8)

    conn.query(sql, data, (err,result) => {
        if(err) return res.send(err)

        sendVerify(req.body.username, req.body.email)

        conn.query(sql2, data, (err, result) => {
            if(err) return res.send(err)

            res.send(result)
        })
    })
})

// Verify user
router.get('/verify', (req, res) => {
    const username = req.query.username
    const sql = `UPDATE users SET verified = true WHERE username = '${username}'`
    const sql2 = `SELECT * FROM users WHERE username = '${username}'`

     conn.query(sql, (err, result) => {
        if(err) return res.send(err.sqlMessage)

         conn.query(sql2, (err, result) => {
            if(err) return res.send(err.sqlMessage)

             res.send('<h1>Verification succeeded</h1>')
        })
    })
})

// Login users
router.post('/users/login', (req, res) => { // LOGIN USER
    const {email, password} = req.body

    const sql = `SELECT * FROM users WHERE email = '${email}'`

    conn.query(sql, async (err, result) => {
        if(err) return res.send(err.message) // Error pada query SQL

        const user = result // Result berupa array of object

        if(!user[0]) return res.send("User not found") // User tidak ditemukan

        if(!user[0].verified) return res.send("Please verify your email") // Belum verifikasi email

        const hash = await bcrypt.compare(password, user[0].password) // true / false

        if(!hash) return res.send("Email and password do not match") // Password salah

        res.send(user) // Kirim object user
    })
})

// Edit user's credentials
router.patch('/users/:userid', async (req, res) => {
    var arrBody = Object.keys(req.body)

    arrBody.forEach(key => {
        if(!req.body[key]){
            delete req.body[key]
        }
    })
    if(req.body.password){
        req.body.password = await bcrypt.hash(req.body.password, 8)
    } 

    const sql = `UPDATE users SET ? WHERE id = ?`
    const sql2 = `SELECT * FROM users WHERE id = ${req.params.userid}`
    const data = [req.body, req.params.userid]

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err.mess)

        conn.query(sql2, data, (err, result) => {
            if(err) return res.send(err.sqlMessage)

            res.send(result)
        })
    })
})

// Get user's credentials by username
router.get('/getusers/:userid', (req, res) => {
    const {userid} = req.params
    var sql = `SELECT * FROM users WHERE id = '${userid}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err.sqlMessage)

        return res.send(result)
    })

})

// Get user's specific credential by email and username in params
router.get('/getusers/:email/:username', (req, res) => {
    const sql = `SELECT * FROM users WHERE email = ? OR username = ?`
    const data = [req.params.email, req.params.username]

    conn.query(sql, data, (err, result) => {
        if(err) res.send(err.sqlMessage)

        res.send(result)
    })
})

// Upload images
const uploadDir = path.join(__dirname + '/../avatar' )
// console.log(__dirname);

const avatarStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, uploadDir)
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
    }
})

const upload = multer ({
    storage: avatarStorage,
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

// Upload avatar
router.post('/avatar', upload.single('avatar'), (req, res) => {
    const sql = `select * from users where id = '${req.body.userid}'`
    const sql2 = `update users set avatar = '${req.file.filename}' where username = '${req.body.username}'`
    console.log(req.file);
    
    conn.query(sql, (err, result) => {
        if(err) return res.send(err.sqlMessage)

        conn.query(sql2, (err, result) => {
            if(err) return res.send(err.sqlMessage)

            res.send({filename: req.file.filename})
        })
    })
})

// Get avatar
router.get('/avatar/:photofile', (req, res) => {
    res.sendFile(`${uploadDir}/${req.params.photofile}`)
})

// Delete avatar
router.delete('/users/:username', (req,res) => {
    const sql = `select * from users where username = ?`
    const sql2 = `update users set avatar = NULL where username = ?`
    const data = req.params.username
    console.log(data);
    
    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err.sqlMessage)

        fs.unlink(`${uploadDir}/${result[0].avatar}`, (err) => {
            if(err) throw err
        })

        conn.query(sql2, data, (err, result) => {
            if(err) return res.send(err.sqlMessage)

            res.send(result)
        })
    })
})

// 


module.exports = router