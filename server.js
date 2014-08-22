var express = require('express')
	, bodyParser = require('body-parser')
	, port = process.env.PORT || 8080
	, morgan = require('morgan');

var app = express();

var server = require('http').Server(app);

var io = require('socket.io')(server);

app.use(express.static('public'));
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var tasks = [ {id: 0, description: "Go to the store", complete: false} ]
	, currentID = 1;

// task format: { id: 0, description: "Go to the store", complete: false }

app.get('/tasks', function(req, res) {
	res.json(tasks)
});

app.post('/tasks', function(req, res) {
	var task = { id: currentID, description: req.body.description, complete: req.body.complete };
	tasks.push(task);
	currentID++;

	res.json(task);
});

app.get('/tasks/:id', function(req, res) {
	var id = req.params.id
		, returnTask = {};

	tasks.forEach(function(task) {
		if (task.id == id)
			returnTask = task;
	});

	res.json(returnTask);
});

app.delete('/tasks/:id', function(req, res) {
	var id = req.params.id;

	for (var i = 0; i < tasks.length; i += 1) {
		if (tasks[i].id == id) {
			tasks.splice(i, 1);
			break;
		}
	}

	res.send();
});

app.put('/tasks/:id', function(req, res) {
	var id = req.params.id
		, returnTask = {};
	

	tasks.forEach(function(task) {
		if (task.id == id) {
			task.description = req.body.description;
			task.complete = req.body.complete;
			returnTask = task;
		}
	});

	res.json(returnTask);
});

app.get('*', function(req, res) {
	res.statusCode = 404;
	res.send("not found");
});

app.listen(port);

console.log('listening on', port);
