const express = require('express');
const port = require('./config');
const cors = require('cors');
const User = require('./models/user');
require('./config/mongoose');

const app = express();
app.use(cors());
app.use(express.json());


// Register new user
app.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(200).send(user)
    } catch (e) {
        res.status(404).send(e)
    }
})

// Login users
app.post('/users/login', async (req, res) => {
    const {email, password} = req.body

     try {
        const user = await User.findByCredentials(email, password) // Function buatan sendiri
        res.status(200).send(user)
        
    } catch (e) {
        res.status(404).send(e)
    }
})


app.listen(port, () => {console.log('API running on port ' + port)
})