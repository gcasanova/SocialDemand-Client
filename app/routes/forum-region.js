import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return Ember.RSVP.hash({
          // load regional posts
          posts: this.store.find('post', {
            locationId: params.region_id,
            locationType: "region"
          }),
          // load regions
          regions: this.store.find('region'),
          // load provinces
          provinces: this.store.find('province', {regionId : params.region_id}),
          // load current region
          region: this.store.find('region', params.region_id)
      });
  }
});
