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

const registerUser = async (args) => {
    console.log('---user registration ----', args);
    
    const {name, age, email, password} = args; 
    try {
     const {data} = await instance.post('/users', {
         name,
         age,
         password,
         email
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

const login = async (email, password) => {
    try {
        const {data} = await instance.post('/login', {
            email,
            password
        })
        console.log('---data----',data);
        
        return data.token;
    } catch (e) {
        throw e;
    }
}
 
module.exports = {fetchUsers, fetchUsersById,registerUser, login};