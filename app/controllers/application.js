import Ember from 'ember';
import GeoLocationMixin from 'social-demand-client/mixins/geolocation-mixin';

export default Ember.Controller.extend(GeoLocationMixin, {
  currentUser: null,
  nameInitial: Ember.computed('currentUser', function() {
    if (this.get('currentUser') != null) {
      return this.get('currentUser').name.substring(0, 1);
    } else {
      return null;
    }
  }),
  init: function() {
    var _this = this;
    if (this.get('session').isAuthenticated) {
      var token = JSON.parse(atob(_this.get('session').store._lastData.secure.token.split(".")[1]));
      var user = JSON.parse(token.sub.toString().replace(/\\/g, ''));
      _this.set('currentUser', user);
    }
  },
  actions: {
    invalidateSession: function() {
      this.get('session').invalidate();
      this.set('currentUser', null);
    }
  }
});
