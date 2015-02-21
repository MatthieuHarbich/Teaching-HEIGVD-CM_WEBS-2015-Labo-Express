var
	_ = require('underscore'),
	express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Issue = mongoose.model('Issue');

module.exports = function (app) {
  app.use('/api/issues', router);
};

function convertMongoIssue(issue) {
	//return user.toObject({ transform: true })
	return {
		id: issue.id,
		
		lastname: user.lastname,
		phone: user.phone,
		roles: user.roles
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

	