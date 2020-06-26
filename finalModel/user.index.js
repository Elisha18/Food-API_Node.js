const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {User,validate} = require("./user.model");
const role = require('../middleware/admin');
const bcrypt = require("bcrypt");
const _ = require("lodash");

router.get("/me", [auth,role.hasRoles("user")] , async (req,res)=>{
    const user = await User.findById(req.user._id).select('-password -role -date -__v');
    res.send(user);
})

// new user if not present
router.post('/',async (req,res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email:req.body.email});
    if(user) return res.status(400).send("User already registered");

    user = new User(_.pick(req.body,["name","email","password","role","isAdmin"]));
    
    //hashing the password
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password,salt);

    user = await user.save();

    //adding JSON web token in payload
    const token = user.generateAuthToken();
    res.header('x-auth-token',token).send(_.pick(user,["_id","name","email"]));
});

router.put('/:id',[auth, role.hasRoles("User")], async (req,res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const {name,email,password,role,isAdmin} = req.body;
    const user = await User.findByIdAndUpdate(req.params.id,{
       name,
       email,
       password,
        role,
        isAdmin
    })
    
    if(!user) return res.status(400).send('Invalid user');

    res.send(user);
})

router.delete('/:id',[auth, role.hasRoles("User")], async (req,res)=>{
    const user = await User.findByIdAndDelete(req.params.id);

    if(!user) return res.status(400).send('Invalid user');

    res.send(user);
})

module.exports = router;