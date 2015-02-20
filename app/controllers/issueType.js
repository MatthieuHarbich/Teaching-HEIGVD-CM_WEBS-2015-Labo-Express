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
  	};
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
                        //id: req.body.id,
			name: req.body.name,
			description: req.body.descr
  			});
                
                issueType.save(function(err, issueTypeSaved) {
//			if(err!==undefined){//essayer une chaine de plus de 32 cara et documenter
//                          console.log("coucou");// res.status(500);
//                        }else{
                         res.status(201).json(convertMongoIssueType(issueTypeSaved));   
//                        }
                        
                        
		});
                
  		});
                
  router.route('/:id')
	.get(function(req, res, next) {
		IssueType.findById(req.params.id, function(err, user) {
			res.json(convertMongoUser(user));
		});
	})

	.put(function(req, res, next) {
		User.findById(req.params.id, function(err, user) {
			user.firstname = req.body.firstname;
			user.lastname = req.body.lastname;
			user.phone = req.body.phone;
			user.roles = req.body.roles;

			user.save(function(err, userSaved) {
				res.json(convertMongoUser(userSaved));
			});
		});
	})

	.delete(function(req, res, next) {
		User.findByIdAndRemove(req.params.id, function(err) {
			res.status(204).end();
		});
	});