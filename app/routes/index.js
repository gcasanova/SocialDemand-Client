import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    // load user default location if it is present in the local storage
    var location = JSON.parse(localStorage.getItem("location"));
    if (location != null) {
      return this.store.find('post', { locationId: location.municipality.id, locationType: "municipality" });
    } else {
      return this.store.find('post', { locationId: 1, locationType: "national" });
    }
  }
});
