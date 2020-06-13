const User = require('../models');
const jwt = require('jsonwebtoken');

const createToken = async (user) => {
    const {email, name} = user;
    const token = await jwt.sign({email, name}, process.env.JWT_SECRET || 'secret_key');
    return token;
}
const registerUser = async (req,res) => {
    console.log('---registerUser ----',req.body);
    
    const {name, email, password, age} = req.body;
    try {
        const newUser = new User({
            name,
            email,
            password,
            age
        })
        const user = await newUser.save();
        res.status(201).send(user);
    } catch (e) {
        console.error('---Error while registering user ---',e);
        res.status(500).send({message: 'Failed to register user'});
    }
}

const loginUser = async (req,res) => {
    console.log('---loginUser ---',req.body);
    
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        console.log('---user ---',user);
        
        if (!user) {
            res.status(401).send({message: 'User does not exist'});
        }
        const match = await user.isValidPassword(password);
        console.log('---match---',match);
        
        if (!match) {
            res.status(401).send({message: 'Password is invalid'});
        }
        const token = await createToken(user);
        console.log('---token---',token);
        res.status(200).send({token: token});
    } catch (e) {
        console.error('---Error while validating user id password ---',e);
        res.status(401).send({message: 'User id or password is invalid'});
    }
}

const fetchAllUsers = async(req,res) => {
    console.log('---fetchAllUsers----');
    
    try {
        const users = await User.find({});
        res.status(200).send(users);
    } catch (e) {
        console.error('--Error while fetching the users ---',e);
        res.status(500).send({message: 'Error fetching the users'});
    }
}

const fetchUsersById = async (req,res) => {
    const {id} = req.params;
    try {
        const user = await User.findOne({_id: id});
        res.status(200).send(user);
    } catch (e) {
        console.error('--Error while fetching the user ---',e);
        res.status(500).send({message: 'Error fetching the user'});
    }
}


module.exports = {registerUser,loginUser, fetchAllUsers, fetchUsersById}