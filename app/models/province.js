import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  regionId: DS.attr('number')
});
