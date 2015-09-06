import Ember from 'ember';

export default Ember.Component.extend({
  model: null, // passed-in
  isRootComment: null, // passed-in
  actions: {
    submit: function (model) {
      this.sendAction("submit", model, this.get('isRootComment'));
    },
    cancel: function () {
      this.sendAction("cancel");
    }
  }
});
