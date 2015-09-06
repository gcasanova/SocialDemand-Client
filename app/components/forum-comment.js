import Ember from 'ember';

export default Ember.Component.extend({
  comment: null, // passed-in
  actions: {
    showReplies: function (comment, isReset) {
      this.sendAction("showReplies", comment, isReset);
    },
    replyComment: function (comment) {
      this.sendAction("replyComment", comment);
    }
  }
});
