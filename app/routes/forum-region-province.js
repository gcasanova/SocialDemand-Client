import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return Ember.RSVP.hash({
          // load province posts
          posts: this.store.find('post', {
            locationId: params.province_id,
            locationType: "province"
          }),
          // load regions
          regions: this.store.find('region'),
          // load provinces
          provinces: this.store.find('province', {regionId : params.region_id}),
          // load municipalities
          municipalities: this.store.find('municipality', {provinceId : params.province_id}),
          // load current region
          region: this.store.find('region', params.region_id),
          // load current province
          province: this.store.find('province', params.province_id)
      });
  }
});
