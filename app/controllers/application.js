import Ember from 'ember';
import GeoLocationMixin from 'social-demand-client/mixins/geolocation-mixin';

export default Ember.Controller.extend(GeoLocationMixin, {
  currentUser: null,
  currentUserLocation: null,
  nameInitial: Ember.computed('currentUser', function() {
    if (this.get('currentUser') != null) {
      return this.get('currentUser').name.substring(0, 1);
    } else {
      return null;
    }
  }),
  init: function() {
    if (this.get('session').isAuthenticated) {
      var token = JSON.parse(atob(this.get('session').store._lastData.secure.token.split(".")[1]));
      var user = JSON.parse(token.sub.toString().replace(/\\/g, ''));
      this.set('currentUser', user);

      // load user default location if it is not present in the local storage
      var location = JSON.parse(localStorage.getItem("location"));
      if (location == null) {
        this.loadUserLocation();
      } else {
        this.set("currentUserLocation", location);
      }
    } else {
      // load user default location if it is not present in the local storage
      var location = JSON.parse(localStorage.getItem("location"));
      if (location != null) {
        this.set("currentUserLocation", location);
      }
    }
  },
  loadUserLocation: function() {
    var _this = this;
    var currentUser = this.get('currentUser');
    var municipality, province, region;
    this.store.find('municipality', currentUser.municipalityId).then(function(response) {
      municipality = response._data;
      _this.store.find('province', municipality.provinceId).then(function(response) {
        province = response._data;
        _this.store.find('region', province.regionId).then(function(response) {
          region = response._data;

          var location = {};
          location.municipality = {};
          location.municipality.id = municipality.id;
          location.municipality.name = municipality.name;

          location.province = {};
          location.province.id = province.id;
          location.province.name = province.name;

          location.region = {};
          location.region.id = region.id;
          location.region.name = region.name;

          localStorage.setItem("location", JSON.stringify(location));
          _this.set("currentUserLocation", location);
        });
      });
    });
  },
  actions: {
    invalidateSession: function() {
      this.get('session').invalidate();
      this.set('currentUser', null);
    }
  }
});
