import DS from 'ember-data';

export default DS.Model.extend({
  	name: DS.attr('string'),
	longitude: DS.attr('number'),
	latitude: DS.attr('number'),
	provinceId: DS.attr('number')
});
