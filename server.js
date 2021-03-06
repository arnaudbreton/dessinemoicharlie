require('newrelic');

var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    methodOverride = require('method-override');
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    errorHandler = require('errorhandler'),
    models = require('./models'),
    Mailjet = require('mailjet-sendemail');

var mailjet = new Mailjet(process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET);
var app = express();

// Database
mongoose.connect(process.env.MONGO_URL);

// Config
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(application_root, "public")));
app.use('/bower_components',  express.static(path.join(application_root, '/bower_components')));
app.use(errorHandler({ dumpExceptions: true, showStack: true }));

// Endpoints
app.get('/', function (req, res) {
  res.sendFile(application_root + '/public/html/index.html');
});

app.get('/api/drawing', function (req, res) {
  return models.Drawing.find(function (err, drawings) {
    if (!err) {
      return res.send(drawings);
    } else {
      return console.log(err);
    }
  });
});

app.post('/api/drawing', function (req, res){
  var drawing;
  console.log("POST: ", req.body);
  drawing = new models.Drawing({
    title: req.body.title,
    description: req.body.description,
    url: req.body.url,
  });
  drawing.save(function (err) {
    if (!err) {
      mailjet.sendContent(process.env.SENDER,
         [process.env.SENDER],
         'Nouveau dessin reçu sur Dessine Moi Charlie',
         'text',
         'Url: ' + drawing.url);
      return res.send(drawing);
    } else {
      console.error(err);
      return res.sendStatus(400);
    }
  });
});

app.get('/api/drawing/random', function (req, res){
	var random = Math.random();

	var callback = function (err, drawing) {
		if(!err) {
			res.send(drawing[0]);
		}
		else {
			console.log(err);
			return res.sendStatus(400);
		}
	};

	models.Drawing
		.where('rnd').gte(random)
		.where('approved').equals(true)
		.limit(1).exec(function (err, drawing) {
  		if (!err && !drawing.length) {
  			models.Drawing
        .where('rnd').lte(random)
        .where('approved').equals(true)
        .limit(1).exec(callback);
  		}
  		else {
  			callback(err, drawing);
  		}
	})
});

app.get('/api/drawing/:id', function (req, res){
  return models.Drawing.findById(req.params.id, function (err, drawing) {
    if (!err) {
      return res.send(drawing);
    } else {
      console.log(err);
      return res.sendStatus(404);
    }
  });
});

app.put('/api/drawing/:id', function (req, res){
  return models.Drawing.findById(req.params.id, function (err, drawing) {
    drawing.title = req.body.title;
    drawing.description = req.body.description;
    drawing.url = req.body.url;
    return drawing.save(function (err) {
      if (!err) {
        console.log("updated");
        return res.send(drawing);
      } else {
        console.log(err);
        return res.sendStatus(400);
      }
    });
  });
});

// Launch server
var server = app.listen(process.env.PORT, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Dessine Moi Charlie listening at http://%s:%s', host, port);
});