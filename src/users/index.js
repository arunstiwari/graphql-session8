const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://localhost:3000/',
    timeout: 1000
})

const fetchUsers = async () => {
    console.log('---inside fetchUsers ----');
    
    try {
        const {data} = await instance.get('/users');
        return data;
    } catch (e) {
        throw e;
    }
}

const createNewUser = async (args) => {
    console.log('----args----',args);
    try {
        const {data} = await instance.post('/users', {
            name: args.user.name,
            age: args.user.age
        })
        return data;
    } catch (e) {
        throw e;
    }
    
}

const fetchUserById = async (id) => {
    console.log('---fetchUserById ---',id);
    try {
        const {data} = await instance.get(`/users/${id}`);
        return data;
    } catch (e) {
      throw e;
    }
    
}

module.exports = { fetchUsers, createNewUser, fetchUserById };