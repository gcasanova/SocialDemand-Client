import Ember from 'ember';
import moment from 'moment';

export default Ember.Controller.extend({
  needs: ['application'],
  currentUser: Ember.computed.alias('controllers.application.currentUser'),
  showNewThread: false,
  actions: {
    newThread: function() {
      if (this.get('currentUser') !== null) {
        this.set("showNewThread", true);
      } else {
        alert("Please login first");
      }
    },
    cancel: function() {
      this.set("showNewThread", false);
    },
    submit: function() {
      if (this.get('currentUser') !== null) {
        var _this = this;
        var onSuccess = function(post) {
          _this.get('model.posts').insertAt(0, post);
          _this.set('showNewThread', false);
        };
        var onFail = function() {
          alert("Something went wrong, please try again later");
          _this.set('showNewThread', false);
        };

        var currentUser = this.get('currentUser');
        this.store.find('user', currentUser.id).then(function (response) {
          var user = response;
          var locationId = _this.get('model.province.id');
          var title = Ember.$('input[name="new-thread-title"]').val();
          var text = Ember.$('textarea[name="new-thread-content"]').val();
          var createdAt = moment().unix() * 1000; // milliseconds

          _this.store.createRecord('post', {
            user: user,
            locationId: locationId,
            locationType: "PROVINCE",
            title: title,
            text: text,
            createdAt: createdAt,
            commentsCount: 0
          }).save().then(onSuccess, onFail);
        });
      } else {
        alert("Please login first");
      }
    }
  }
});
