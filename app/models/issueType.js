var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var IssueTypeSchema = new Schema({
  name: String,
  description: String
});


// // Example of how we can use mongoose to transform data from the DB into
// // an object we can use. It's a sort of Entity <-> TO transformation

// //if (!UserSchema.options.toObject) UserSchema.options.toObject = {};
// //UserSchema.options.toObject.hide = '';
// //UserSchema.options.toObject.transform = function (doc, ret, options) {
// //  if (options.hide) {
// //    options.hide.split(' ').forEach(function (prop) {
// //      delete ret[prop];
// //    });
// //  }
// //	ret.id = ret._id;
// //	delete ret['_id'];
// //	delete ret['__v'];
// //}

// IssueTypeSchema.virtual('date')
//   .get(function(){
//     return this._id.getTimestamp();
//   });

mongoose.model('IssueType', IssueTypeSchema);

