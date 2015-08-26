import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    showReplies: function (comment) {
      var _this = this;
      var model = this.get('model');
      var comments = model._data.comments;
      if (Ember.$('#replies-comment-' + comment.id).is(':empty')) {
        Ember.$.each(comment._data.comments, function (index, value) {
          this.store.find('comment', value.id).then(function(response) {
            _this.store.find('user', response._data.user).then(function(response2) {
                var username = response2._data.name;
                var html = _this.addComment(response._data, username, 25);
                comments.insertAt(1, response._data);
                //Ember.$('#replies-comment-' + comment.id).append(html);
                Ember.$('#arrow-comment-' + comment.id).removeClass('fa-chevron-down').addClass('fa-chevron-up');
            });
          });
        });
      } else {
        Ember.$('#replies-comment-' + comment.id).empty();
        Ember.$('#arrow-comment-' + comment.id).removeClass('fa-chevron-up').addClass('fa-chevron-down');
      }
    }
  },
  addComment: function (comment, username, indentation) {
    var html = '<hr class="divider" width="1000"><div class="row comment-row"><div class="col-xs-2" /><div class="col-xs-8"><!-- comment --><div class="col-xs-1" /><div class="col-xs-10"><div style="margin-left:' + indentation + 'px" class="comment-content-inner"><p class="comment-author">' + username + ' | ' + moment(comment.createdAt).fromNow() + '</p><p class="comment-text">' + comment.text + '</p>';
    // if (comment.commentsCount > 1) {
    //   html += '<span + 'action "showReplies" comment' + class="comment-replies">' + comment.commentsCount + ' Replies <i id="arrow-comment-' + comment.id + '" class="fa fa-chevron-down"></i></span>';
    // } else if (comment.commentsCount === 1) {
    //   html += '<span {{action "showReplies" comment}} class="comment-replies">' + comment.commentsCount + ' Reply <i id="arrow-comment-' + comment.id + '" class="fa fa-chevron-down"></i></span>';
    // }
    html += '</div></div><div class="col-xs-1" /></div><div class="col-xs-2" /></div>';
    return html;
  }
});
