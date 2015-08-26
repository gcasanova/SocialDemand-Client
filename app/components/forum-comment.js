import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['comment'],
  comment: null, // passed-in,
  actions: {
    showReplies: function (comment) {
      this.sendAction("action", comment);
    }
  }
});
