var mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator:
          validator.isEmail,
          message: '{VALUE} is not valid email'
    }


  },
  password:{
    type: String,
    require: true,
    minlength:6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});


UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);
}
//UserSchema.mehtods for instance(user) binding this
//cannot use arrow function as it doesnt bind to this
UserSchema.methods.generateAuthToken = function () {
  var  user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access: access}, 'abc123').toString();

  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });
};

UserSchema.statics.findbyCredential = function (email, password) {
  var User = this;
  return User.findOne({email}).then((user) => {
    if(!user){
      return Promise.reject();
    }
    return new Promise ((resolve, reject) => {
      //User bcrypt
      if(bcrypt.compare(password, user.password, (error, result) => {
          if(result) {
            resolve(user);
          }
          else {
              reject();
          }
      }));
    });
  });
};

//UserSchema.mehtods for model(USER) binding this
UserSchema.statics.findByToken = function (token) {
  var User = this; //THis here is a model not instance user like above function
  var decoded;
  try {
    decoded = jwt.verify(token, 'abc123');
  } catch(e){
    // return new Promise((resolve, reject) => {
      // reject();
    // })
    //below is same as above
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token, //quotes are required when we have . in the valude such as tokens.token
    'tokens.access': 'auth'
  });
};

UserSchema.pre('save', function (next) {
  var user = this;
  if(user.isModified('password')){
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, result) => {
          if(!err){
            user.password = result;
            next();
          }
        });
    });
  }
  else {
    next();
  }
});



var User = mongoose.model('User', UserSchema);



module.exports = {User};
