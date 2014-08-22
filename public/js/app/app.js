var Task = Backbone.Model.extend({
});

var Tasks = Backbone.Collection.extend({
	url: '/tasks'
	, complete: function() {
		return this.where({ complete: true});
	}
	, remaining: function() {
		return this.where({ complete: false});
	}
});

// TaskView should handle the editing, completion, and deletion of existing tasks
// Render should just template and return this task
// Complete should just make the text grey out, so maybe just add a class that specifies that style
var TaskView = Backbone.View.extend({
	tagName: 'li'
	, className: 'list-group-item'
	, template: _.template($("#taskViewTemplate").html())
	, events: {
		'click [type="checkbox"]': 'checked'
		, 'dblclick label': 'edit'
	}
	, render: function() {
		if (this.model.get('complete'))
			this.$el.addClass('complete');
		this.$el.html(this.template(this.model.toJSON()));
		this.toggleVisible();
		return this;
	}
	, checked: function() {
		var currentComplete = this.model.get("complete");
		this.model.set({ complete: !currentComplete });
		this.model.save();
	}
	, edit: function() {
		this.$el.addClass('editing');
		console.log('editing');
	}
	, isHidden: function() {
		return this.model.get('complete');
	}
	, toggleVisible: function() {
		this.$el.toggleClass('hidden', this.isHidden());
	}
});

// TasksView should handle the creation of new tasks
// Render should append new TaskView for each task in collection
var TasksView = Backbone.View.extend({
	initialize: function(options) {
		// main jQuery object
		this.main = options.main;
		this.tasks = options.tasks;
	}
	, className: 'well col-md-6'
	, template: _.template($("#tasksViewTemplate").html())
	, events: {
		"keyup :input": 'keyup'
	}
	, render: function() {
		this.$el.html(this.template());

		tlv = new TaskListView({ collection: this.tasks });
		this.$el.append(tlv.render().$el);

		this.main.html(this.$el);

		return this;
	}
	, keyup: function(e) {
		if (e.keyCode == 13) {
			var taskInput = $('#task-input');
			var description = taskInput.val();
			var newTask = new Task({ description: description, complete: false });
			this.tasks.add(newTask);
			newTask.save();
			taskInput.val("");
		}
	}
});

var TaskListView = Backbone.View.extend({
	initialize: function() {
		this.listenTo(this.collection, 'change', this.render);
		this.listenTo(this.collection, 'add', this.render);
	}
	, tagName: 'ul'
	, className: 'list-group'
	, render: function() {
		this.$el.html("");
		this.collection.each(function(task) {
			var taskView = new TaskView({ model: task });
			this.$el.append(taskView.render().el);
		}, this);
		return this;
	}
	, renderItem: function(task) {
	}
});

///////////////////////////////////////////////////////////////////////

var tasks = new Tasks();
tasks.fetch();

var tasksView = new TasksView({ tasks: tasks, main: $('#main') });

tasksView.render()
