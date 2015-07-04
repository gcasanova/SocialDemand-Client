import Ember from 'ember';

export default Ember.Controller.extend({
	init: function() {
		alert("Verication was successful");
		this.transitionToRoute('login');
	}
});
