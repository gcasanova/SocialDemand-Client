import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application'],
  currentUser: Ember.computed.alias('controllers.application.currentUser'),
  actions: {
    authenticate: function() {
      var _this = this;
      var credentials = this.getProperties('identification', 'password'),
        authenticator = 'simple-auth-authenticator:jwt';

      this.get('session').authenticate(authenticator, credentials).then(function() {
        var token = JSON.parse(atob(_this.get('session').store._lastData.secure.token.split(".")[1]));
        var user = JSON.parse(token.sub.toString().replace(/\\/g, ''));
        _this.set("currentUserLocation", null);
        _this.set('currentUser', user);
        _this.set('password', '');
        _this.transitionToRoute('index');
      }, function() {
        alert("Login failed!");
      });
    }
  }
});
