import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.belongsTo('user', {async: true}),
  text: DS.attr('string'),
  createdAt: DS.attr('number'),
  rootComment: DS.attr('boolean'),
  parentId: DS.attr('number'),
  commentsCount: DS.attr('number'),
  comments: DS.hasMany('comments', {async: true}),
  showingChildren: false,
  showingReplyBox: false,
  indentation: 0,
  hasComments: function () {
    return this.get('commentsCount') > 1;
  }.property('commentsCount'),
  hasComment: function () {
    return this.get('commentsCount') === 1;
  }.property('commentsCount')
});
