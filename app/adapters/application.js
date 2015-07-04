import DS from 'ember-data';

export default DS.RESTAdapter.extend({
	namespace: 'api',
	headers: {
		'Content-type': 'application/json'
	}
});
