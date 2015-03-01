 var
	_ = require('underscore'),
	express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Issue = mongoose.model('Issue'),
  User = mongoose.model('User'),
	IssueType = mongoose.model('IssueType'),
  Comment = mongoose.model('Comment'),
  Action = mongoose.model('Action'),
  ActionType = mongoose.model('ActionType');

module.exports = function (app) {
  app.use('/api/issues', router);
};

function convertMongoIssue(issue) {
	//return user.toObject({ transform: true })
	return {
		id: issue.id,
		author:issue.author,
		issueType: issue.issueType,
		description: issue.description,
		assign: issue.assign,
		longitude: issue.longitude,
		latitude: issue.latitude,
		status: issue.status,
		createdAt:issue.createdAt,
		solvedAt:issue.solvedAt,
		tags:issue.tags,
		comments: issue.comments
	}
	
}


function convertMongoAction(action){
	return{
		id: action.id,
		actionType: action.actionType,
		author: action.author,
		date: action.date
	}
}

function decorate(query) {
  return query
    .populate('comments.author comments author issueType assign')
}

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}



router.route('/')
	.get(function(req, res, next) {
		console.log(Object.keys(req.query).length);

		if (Object.keys(req.query).length === 0) {
			decorate(Issue.find())
			.exec(function (err, issues){
				if (err) return next(err);
				res.json(_.map(issues, function(issue) {
					return convertMongoIssue(issue);
				}));
			});	
		} else if(isInArray("user", Object.keys(req.query))){
			
			var userId = req.query.user;

	
			decorate(Issue.where('author', userId).find(function(err, issues){
				//console.log(issues);
				if(err) return next(err);

				res.json(_.map(issues, function(issue) {
					return convertMongoIssue(issue);
				}));
			}));


			
		} else if(isInArray("type", Object.keys(req.query))){
			var type = req.query.type;
			
	
	
			decorate(Issue.where('issueType', type).find(function(err, issues){
				
				if(err) return next(err);

				res.json(_.map(issues, function(issue) {
					return convertMongoIssue(issue);
				}));
			}));

		}else if(isInArray("lng", Object.keys(req.query)) && isInArray("lat", Object.keys(req.query)) ){
			if(isInArray("rayon", Object.keys(req.query))){
				var ray = req.query.rayon;

				var lat = req.query.lat;
				var lng = req.query.lng;
		
				decorate(Issue.where('latitude').gt(lat - ray).lt((lat*1) + ray).where("longitude").gt(lng - ray).lt((lng*1) + ray).find(function(err, issues){
					//console.log(issues);
					if(err) return next(err);

					res.json(_.map(issues, function(issue) {
						return convertMongoIssue(issue);
					}));
				}));
			
			}else{
				var lat = req.query.lat;
				var lng = req.query.lng;
		
				decorate(Issue.where('latitude').gt(lat - 2).lt((lat*1) + 2).where("longitude").gt(lng - 2).lt((lng*1) + 2).find(function(err, issues){
					//console.log(issues);
					if(err) return next(err);

					res.json(_.map(issues, function(issue) {
						return convertMongoIssue(issue);
					}));
				}));
			}
			
		}else if(isInArray("sdStart", Object.keys(req.query)) && isInArray("sdEnd", Object.keys(req.query)) ){
							
				var d1 = req.query.sdStart.split("-");
				var d2 = req.query.sdEnd.split("-");

				var startD = d1[0];
				var startM = d1[1] - 1;
				var startY = d1[2];

				var endD = d2[0];
				var endM = d2[1] - 1;
				var endY = d2[2];				
				

				var start = new Date(startY, startM, startD);
				var end = new Date(endY, endM, endD);



				decorate(Issue.find({solvedAt: {$gte: start, $lt: end}},function(err, issues){
					if(err) return next(err);

					res.json(_.map(issues, function(issue) {
						return convertMongoIssue(issue);
					}));
				}));	
			
			}else if(isInArray("cdStart", Object.keys(req.query)) && isInArray("cdEnd", Object.keys(req.query)) ){
							
				var d1 = req.query.cdStart.split("-");
				var d2 = req.query.cdEnd.split("-");

				var startD = d1[0];
				var startM = d1[1] - 1;
				var startY = d1[2];

				var endD = d2[0];
				var endM = d2[1] - 1;
				var endY = d2[2];				
				

				var start = new Date(startY, startM, startD);
				var end = new Date(endY, endM, endD);



				decorate(Issue.where("status").ne("Solved").find({createdAt: {$gte: start, $lt: end}},function(err, issues){
					if(err) return next(err);

					res.json(_.map(issues, function(issue) {
						return convertMongoIssue(issue);
					}));
				}));	
			
			};
		

		})	
	

	.post(function (req, res, next){
		var issue = new Issue({
			author: req.body.userId, 
			issueType: req.body.issueTypeId,
			description: req.body.description,
			longitude: req.body.longitude,
			latitude: req.body.latitude,
			status: "Created",
			tags:req.body.tags,
			comments: req.body.comments
		});
			console.log(issue);	
		issue.save(function(err, issueSaved){
			res.status(201).json(convertMongoIssue(issueSaved));
			
		});
	});

router.route('/:id')
    .get(function(req, res, next){
	    decorate(Issue.findById(req.params.id))
	      .exec(function(err, issue){
	        res.json(convertMongoIssue(issue));
	      });
  		})
	

	.put(function(req, res, next){
		Issue.findById(req.params.id, function(err, issue){
			
			issue.tags = req.body.tags;
			
			

			issue.save(function(err, issueSaved){
				res.json(convertMongoIssue(issueSaved));
			});
		});
	})

	.delete(function(req, res, next){
		Issue.findByIdAndRemove(req.params.id, function(err){
			res.status(204).end();
		});
	});

router.route('/:id/action')

	.get(function(req, res, next){
		decorate(Action.find({"issueId":req.params.id}))
			.exec(function (err, actions){
				if (err) return next(err);
				res.json(_.map(actions, function(action) {

					console.log(action);
					return convertMongoAction(action);
				}));
			})
	})

	.post(function(req, res, next){
		var action = new Action({
			actionType: req.body.actionType,
			author:req.body.userId,
			issueId: req.params.id
		})

		switch(action.actionType) {
		    case "addComment":
		       	var comment = new Comment({
		       		author: req.body.userId,
		       		content: req.body.content
		       	})	
		       	console.log(comment);
				Issue.findByIdAndUpdate(
						{_id: req.params.id},
						{$push: {comments: comment}},						
						function(err, issue){
							if(err)return console.log("error");
							
							comment.save(function(err, commentSaved){
								action.save();
				       			issue.comments.push(commentSaved.id);
				       			res.json(convertMongoIssue(issue));
				       		})
						}
					);
		        break; 
		    default:
		        
		} 
		

		console.log(action.actionType);
		//console.log(comment.content);
		console.log(req.params.id);
	})


	.put(function(req, res, next){
		var action = new Action({
			actionType: req.body.actionType,
			author: req.body.userId,
			issueId: req.params.id
		})

		switch(action.actionType){
			case "takeIssue":

				Issue.findById(req.params.id, function(err, issue){

				issue.status = "Taken";
				

				issue.save(function(err, issueSaved){
					action.save();
					console.log(action);
					res.json(convertMongoIssue(issueSaved));
				});
			})

				break;
			case "aknowledge":
			Issue.findById(req.params.id, function(err, issue){

				issue.status = "aknowledged";
				

				issue.save(function(err, issueSaved){
					action.save();
					res.json(convertMongoIssue(issueSaved));
				});
			})

				break;

			case "solveIssue":

			Issue.findById(req.params.id).exec(function(err, issue){

				issue.status = "Solved";

				var now = new Date();
				console.log(now);

				issue.solvedAt = now;

				console.log(issue);
					issue.save(function(err, issueSaved){
						action.save();
						res.json(convertMongoIssue(issueSaved));
					});
			
				
			});


				break;
			case "assignIssue":
			Issue.findById(req.params.id, function(err, issue){

				User.findById(req.body.assignId, function(err, user){
					console.log(user.roles.indexOf("staff"));

					var isStaff = user.roles.indexOf("staff");

					if(isStaff >= 0){
					 	issue.assign = req.body.assignId;
						issue.status = "Assigned";

						issue.save(function(err, issueSaved){
						if(err) return console.log("erreur" + err);
							action.save();
							res.json(convertMongoIssue(issueSaved));
						});
					}else{
						res.json({
							"error":"user is not a staff, please choose an other one"
						})
					};
				})
				
				

				
			})
				
				break;
			case "rejectIssue":
			Issue.findById(req.params.id, function(err, issue){

				issue.status = "rejected";
				console.log(issue);

				issue.save(function(err, issueSaved){
					action.save();
					res.json(convertMongoIssue(issueSaved));
				});
			}) 

				break;
			default:

		}
	})




	