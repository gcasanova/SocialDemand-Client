import Ember from 'ember';

export default Ember.Controller.extend({
  init: function() {
    alert("This confirmation link is no longer valid");
    this.transitionToRoute('index');
  }
});
