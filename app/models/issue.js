  var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

  var CommentSchema = mongoose.model('Comment').schema;


var IssueSchema = new Schema({
  author: {type:Schema.Types.ObjectId, ref: "User"},
  issueType: {type:Schema.Types.ObjectId, ref: "IssueType"},
  createdAt: {type: Date, default: Date.now },
  solvedAt: {type: Date, default: null },
  description: String,  
  assign: {type:Schema.Types.ObjectId, ref: "User"},
  longitude: Number,
  latitude: Number,
  status: String,
  tags:[String],
	comments: [CommentSchema]
});

// Example of how we can use mongoose to transform data from the DB into
// an object we can use. It's a sort of Entity <-> TO transformation

//if (!UserSchema.options.toObject) UserSchema.options.toObject = {};
//UserSchema.options.toObject.hide = '';
//UserSchema.options.toObject.transform = function (doc, ret, options) {
//  if (options.hide) {
//    options.hide.split(' ').forEach(function (prop) {
//      delete ret[prop];
//    });
//  }
//	ret.id = ret._id;
//	delete ret['_id'];
//	delete ret['__v'];
//}



mongoose.model('Issue', IssueSchema);

