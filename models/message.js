const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const connection = require('../config/database');
const moment = require('moment');

const MessageSchema = new Schema(
  {
    title: {type: String, required: true},
    text: {type: String, required: true},
    timestamp: {type: Date, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'}
  }
);

// Virtual for Item's URL
MessageSchema
  .virtual('url')
  .get(function () {
    return '/message/' + this._id;
});

// Virtual for formated date
MessageSchema
  .virtual('formated_date')
  .get(function () {
    if (this.timestamp) {
      return moment(this.timestamp).format('DD-MM-YYYY');
    }
});


//Export model
module.exports = connection.model('Message', MessageSchema);