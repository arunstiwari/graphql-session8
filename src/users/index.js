const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://localhost:3000/',
    timeout: 1000
})

const fetchUsers = async ()=> {
    try {
      const {data} = await instance.get('/users');
      return data;
    } catch (e) {
        throw e;
    }
}

const createNewUser = async (args) => {
    try {
     const {data} = await instance.post('/users', {
         name: args.name,
         age: args.age
     })
     return data;
    } catch (e) {
        throw e;
    }
}

const fetchUsersById = async (id) => {
    console.log('--fetchUsersById ---',id);
    
    try {
     const {data} = await instance.get(`/users/${id}`);
       console.log(`--fetchUsersById ---${id}  --data ${data}`);
     return data;
    } catch (e) {
        throw e;
    }
}

module.exports = {fetchUsers, fetchUsersById,createNewUser};