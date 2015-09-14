import Ember from 'ember';
import moment from 'moment';

export default Ember.Controller.extend({
  needs: ['application'],
  currentUser: Ember.computed.alias('controllers.application.currentUser'),
  replyPost: false,
  showingReplyBox: null,
  actions: {
    showReplies: function (comment, isReset) {
      var _this = this;
      var currentUser = this.get('currentUser');

      this.get('model.comments').then(function (comments) {
        var shown = false;
        var i = _this.get('model.comments').indexOf(comment) + 1;
        var j = i; // reference to insert comment of current user first

        // verify if comments are currently shown and update chevron arrow direction
        _this.store.find('comment', comment._data.comments[0].id).then(function (response) {
          if (comments.indexOf(response) > -1) {
            shown = true;
            comment.set('showingChildren', false);
          } else {
            comment.set('showingChildren', true);
          }
          _this.removeChildren(comment, comments, _this);

          if (!shown || isReset) {
            // iterate and insert comments
            Ember.$.each(comment._data.comments, function (index, value) {
              _this.store.find('comment', value.id).then(function (response) {
                response.set('indentation', comment.get('indentation') + 25);
                if (response._data.user !== currentUser.id) {
                  comments.insertAt(i, response);
                } else {
                  comments.insertAt(j, response);
                }
                i++;
              });
            });
          }
        });
      });
    },
    replyPost: function() {
      if (this.get('currentUser') !== null) {
        var comment = this.get("showingReplyBox");
        if (comment !== null) {
          comment.set("showingReplyBox", false);
          this.set("showingReplyBox", null);
        }
        this.set('replyPost', true);
      } else {
        alert("Please login first");
      }
    },
    replyComment: function(aComment) {
      if (this.get('currentUser') !== null) {
        this.set('replyPost', false);

        var comment = this.get("showingReplyBox");
        if (comment !== null) {
          comment.set("showingReplyBox", false);
          this.set("showingReplyBox", null);
        }

        aComment.set("showingReplyBox", true);
        this.set("showingReplyBox", aComment);
      } else {
        alert("Please login first");
      }
    },
    submit: function (parent, isRootComment) {
      if (this.get('currentUser') !== null) {
        var _this = this;
        var onSuccess = function(comment) {
          if (isRootComment) {
            _this.get('model.comments').then(function (comments) {
              comments.addObject(comment);
              _this.set('model.commentsCount', _this.get('model.commentsCount') + 1);

              _this.set('replyPost', false);
              comment = _this.get("showingReplyBox");
              if (comment !== null) {
                comment.set("showingReplyBox", false);
                _this.set("showingReplyBox", null);
              }
            });
          } else {
            parent.set("commentsCount", parent._data.commentsCount++);

            if (parent._data.comments == undefined) {
              parent._data.comments = [];
            }
            parent._data.comments.addObject(comment);
            _this.send("showReplies", parent, true);

            _this.set('replyPost', false);
            comment = _this.get("showingReplyBox");
            if (comment !== null) {
              comment.set("showingReplyBox", false);
              _this.set("showingReplyBox", null);
            }
          }
        };
        var onFail = function(comment) {
          alert("Something went wrong, please try again later");
          _this.set('replyPost', false);

          comment = this.get("showingReplyBox");
          if (comment !== null) {
            comment.set("showingReplyBox", false);
            this.set("showingReplyBox", null);
          }
        };

        var currentUser = this.get('currentUser');
        this.store.find('user', currentUser.id).then(function (response) {
          var user = response;
          var text = Ember.$('textarea').val();
          var createdAt = moment().unix() * 1000; // milliseconds

          _this.store.createRecord('comment', {
            user: user,
            text: text,
            createdAt: createdAt,
            rootComment: isRootComment,
            parentId: parent._data.id,
            commentsCount: 0
          }).save().then(onSuccess, onFail);
        });
      } else {
        alert("Please login first");
      }
    },
    cancel: function () {
      // hide post reply textarea
      this.set('replyPost', false);

      var comment = this.get("showingReplyBox");
      if (comment !== null) {
        comment.set("showingReplyBox", false);
        this.set("showingReplyBox", null);
      }
    }
  },
  removeChildren: function (comment, comments, _this) {
    // iterate and delete comments
    Ember.$.each(comment._data.comments, function (index, value) {
      _this.store.find('comment', value.id).then(function (response) {
        if (response.get('showingChildren')) {
          _this.removeChildren(response, comments, _this);
        }

        response.set('showingChildren', false);
        comments.removeObject(response);
      });
    });
  }
});
