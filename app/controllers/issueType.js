var
	_ = require('underscore'),
	express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  IssueType = mongoose.model('IssueType');

  module.exports = function(app){
  	app.use('/api/issueTypes', router);
  };

  function convertMongoIssueType(issueType){
  	return {
  		id: issueType.id,
  		name: issueType.name,
  		description: issueType.description
  	}
  }

  router.route('/')
  		.get(function(req, res, next){
  			IssueType.find(function (err, issueTypes){
  				if(err) return next(err);
  				res.json(_.map(issueTypes, function(issueType){
  					return convertMongoIssueType(issueType);
  				}));
  			});
  		})

  		.post(function(req, res, next){
  			var issueType = new IssueType({
  				
  			})
  		})