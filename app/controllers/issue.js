 var
	_ = require('underscore'),
	express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Issue = mongoose.model('Issue');
  User = mongoose.model('User');
  IssueType = mongoose.model('IssueType');
  Comment = mongoose.model('Comment');

module.exports = function (app) {
  app.use('/api/issues', router);
};

function convertMongoIssue(issue) {
	//return user.toObject({ transform: true })
	return {
		id: issue.id,
		author: User,
		issueType: IssueType,
		description: issue.description,
		longitude: issue.longitude,
		latitude: issue.latitude,
		status: issue.status,
		comments: Comment
	}
}
router.route('/')

	.get(function(req, res, next) {
		Issue.find(function (err, issues) {
		  if (err) return next(err);
		  res.json(_.map(issues, function(issue) {
				return convertMongoIssue(issue);
			}));
		});
	})

	.post(function (req, res, next){
		var issue = new Issue({
			author: req.body.User,
			issueType: req.body.IssueType,
			description: req.body.description,
			longitude: req.body.longitude,
			latitude: req.body.latitude,
			status: req.body.status,
			comments: req.body.Comment
		});

		issue.save(function(err, issueSaved){
			res.status(201).json(convertMongoIssue(issueSaved));
		});
	});

	