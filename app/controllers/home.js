var
  _ = require('underscore'),
  express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User');
module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
 
    
    res.render('index', {
      title: 'Generator-Express MVC'
     
    });
 
});
