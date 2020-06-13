const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    age: Number
})

UserSchema.pre('save', async function(next){
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
})

UserSchema.methods.isValidPassword = async function(newPassword){
    const match = await bcrypt.compare(newPassword, this.password);
    return match;
}

// Duplicate the ID field.
UserSchema.virtual('id').get(function(){
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
UserSchema.set('toJSON', {
  virtuals: true
}); 
const User = mongoose.model('users', UserSchema);

module.exports = User;