const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const connection = require('../config/database');
const moment = require('moment');

const UserSchema = new Schema(
  {
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    uname: {type: String, required: true},
    membership: {type: Boolean},
    isAdmin: {type: Boolean},
    hash: {type: String},
    salt: {type: String}
  }
);

// Virtual for Item's URL
UserSchema
  .virtual('url')
  .get(function () {
    return '/user/' + this._id;
});

UserSchema
.virtual('name')
.get(function () {
  let fullname = '';
  if (this.first_name && this.last_name) {
    fullname = this.last_name + ', ' + this.first_name
  }
  if (!this.first_name || !this.last_name) {
    fullname = '';
  }
  return fullname;
});

//Export model
module.exports = connection.model('User', UserSchema);