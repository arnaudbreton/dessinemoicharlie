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
app.use(errorHandler({ dumpExceptions: true, showStack: true }));

// Endpoints
app.get('/', function (req, res) {
  res.sendfile(application_root + '/public/html/index.html');
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
  console.log("POST: ");
  console.log(req.body);
  drawing = new models.Drawing({
    title: req.body.title,
    description: req.body.description,
    url: req.body.url,
  });
  drawing.save(function (err) {
    if (!err) {
      console.log(process.env.SENDER);
      mailjet.sendContent(process.env.SENDER,
         [process.env.SENDER],
         'Nouveau dessin reçu sur Dessine Moi Charlie',
         'text',
         'Url: ' + drawing.url);
      return console.log("created");

    } else {
      return console.log(err);
    }
  });
  return res.send(drawing);
});

app.get('/api/drawing/random', function (req, res){
	var random = Math.random();

	var callback = function (err, drawing) {
		if(!err) {
			res.send(drawing[0]);
		}
		else {
			console.log(err);
			res.sendStatus(400);
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
      return console.log(err);
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
      } else {
        console.log(err);
      }
      return res.send(drawing);
    });
  });
});

// Launch server
app.listen(process.env.PORT);