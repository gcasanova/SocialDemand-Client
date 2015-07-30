import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application'],
  currentUserLocation: Ember.computed.alias('controllers.application.currentUserLocation'),
  init: function() {
    var location = this.get('currentUserLocation');

    if (location != null) {
      window.location.replace("/forum/region/" + location.region.id + "/province/" + location.province.id + "/municipality/" + location.municipality.id);
    } else {
      this.transitionToRoute('forum');
    }
  }
});
