import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    // load national posts
    return this.store.find('post', {
      locationId: 1,
      locationType: "national"
    });
  }
});
