import Ember from 'ember';
import config from '../config/environment';

export default Ember.Controller.extend({
  actions: {
    forgotten: function() {
      var _this = this;
      var data = this.getProperties('email');

      Ember.$.ajax({
        type: 'POST',
        url: config.host + '/api/auth/reset?email=' + data.email,
        dataType: 'json',
        contentType: 'application/json'
      }).then(function() {}, function(data) {
        if (data.status === 200) {
          alert("Check out your email inbox and use the confirmation link to reset your password");
          _this.set('email', '');
          _this.transitionToRoute('index');
        } else if (data.status === 404) {
          alert("This email has not been registered before");
        } else {
          alert("Something went wrong, please try again later");
        }
      });
    }
  }
});
