const express = require('express');
const port = require('./config');
const cors = require('cors');

// Import models
const User = require('./models/user');
const Address = require('./models/address');
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
        const user = await User.findByCredentials(email, password)
        res.status(200).send(user)
        
    } catch (e) {
        res.status(404).send(e)
    }
})

// Post address
app.post('/addresses/:userid', async (req, res) => {
    try {
        const user = await User.findById(req.params.userid)
        if(!user){
            throw new Error("Unable to create address")
        }
        const address = new Address({...req.body, owner: user._id})
        user.addresses = user.addresses.concat(address._id)
        await address.save()
        await user.save()
        res.status(201).send(address)     
    } catch (e) {
        res.status(404).send(e)
        console.log(e);
        
    }
})

// Delete user and address
app.delete('/users/:userid', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userid)
        if(!user){
            throw new Error("unable to delete")
            
        }
        await Address.deleteMany({owner: user._id}).exec()
        res.send("delete successful")
    } catch (e) {
        res.send(e)
        
    }
})

// Delete address
app.delete("/addresses", async (req, res) => {
    try {
      const address = await Address.findOneAndDelete({ _id: req.body.addressid });
      const user = await User.findOne({ _id: req.body.owner });
  
       if (!address) {
        return res.status(404).send("Delete failed");
      }
    
      user.addresses = await user.addresses.filter(val => val != req.body.addressid);
      user.save();
      console.log(user.addresses);
  
      res.status(200).send(address);
    } catch (e) {
      res.status(500).send(e);
    }
})


app.listen(port, () => {console.log('API running on port ' + port)
})