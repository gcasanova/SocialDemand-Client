import Ember from 'ember';

export default Ember.Controller.extend({
  resetFailed: false,
  errorMessage: null,
  actions: {
    reset: function() {
      var _this = this;
      var data = this.getProperties('email', 'password', 'password2');

      if (data.email == null) {
        this.set('errorMessage', 'Please enter an email');
        this.set('resetFailed', true);
        return;
      }

      var str = Ember.$.trim(data.password);
      if (str == null || str.length === 0) {
        this.set('errorMessage', 'Please enter a password');
        this.set('resetFailed', true);
        return;
      } else if (str.length < 8 || str.length > 20) {
        this.set('errorMessage', 'Password should have between 8 and 20 characters');
        this.set('resetFailed', true);
        return;
      } else if (!/^[A-Za-z0-9]+$/.test(str)) {
        this.set('errorMessage', 'Password can only contain alphanumeric characters');
        this.set('resetFailed', true);
        return;
      } else if (data.password !== data.password2) {
        this.set('errorMessage', 'Passwords do not match, please try again');
        this.set('resetFailed', true);

        this.set('password', '');
        this.set('password2', '');
        return;
      }

      Ember.$.ajax({
        type: 'POST',
        beforeSend: function(request) {
          request.setRequestHeader("Email", data.email);
          request.setRequestHeader("Password", data.password);
        },
        url: '/api/auth/change',
        dataType: 'json',
        contentType: 'application/json'
      }).then(function() {}, function(data) {
        if (data.status === 200) {
          alert("Password changed, please log in");
          _this.set('email', '');
          _this.set('password1', '');
          _this.set('password2', '');

          _this.transitionToRoute('login');
        } else if (data.status === 404) {
          alert("This email does not belong to any user");
        } else if (data.status === 403) {
          alert("Please request an email reset from the login page first");
          _this.transitionToRoute('login');
        } else {
          alert("Something went wrong, please try again later");
        }
      });
    }
  }
});
