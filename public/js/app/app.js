var Task = Backbone.Model.extend({

});

var Tasks = Backbone.Collection.extend({

});

// TaskView should handle the editing, completion, and deletion of existing tasks
// Render should just template and return this task
var TaskView = Backbone.View.extend({
	events: {

	}
});

// TasksView should handle the creation of new tasks
// Render should append new TaskView for each task in collection
var TasksView = Backbone.View.extend({
	events: {

	}
});

// don't need a router
// this should be everything I need
