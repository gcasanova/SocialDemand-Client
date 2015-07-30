import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.belongsTo('user', {async: true}),
  locationId: DS.attr('number'),
  locationType: DS.attr('string'),
  title: DS.attr('string'),
  text: DS.attr('string'),
  createdAt: DS.attr('number'),
  commentsCount: DS.attr('number'),
  comments: DS.hasMany('comments', {async: true})
});
