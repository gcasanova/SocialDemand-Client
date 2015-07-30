import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application'],
  currentUser: Ember.computed.alias('controllers.application.currentUser'),
  number: 0,
  verification: '',
  isValidNumber: false,
  madePhoneCall: false,
  check: [
    "T", "R", "W", "A", "G", "M", "Y", "F", "P", "D", "X", "B", "N", "J", "Z", "S", "Q", "V", "H", "L", "C", "K", "E"
  ],
  geoIpLookupFunc: function(callback) {
    Ember.$.getJSON('//www.telize.com/geoip')
      .always(function(resp) {
        if (!resp || !resp.country_code) {
          callback('');
        }

        callback(resp.country_code);
      });
  },
  actions: {
    upgrade: function() {
      var _this = this;

      // make sure error message is hidden
      this.set('upgradeFailed', false);

      // validate document number
      var document = this.get('document');

      if (document == null) {
        this.set('errorMessageUpgrade', 'Please provide your official document number');
        this.set('upgradeFailed', true);
        return;
      } else if (document.length !== 9) {
        if (document.length > 9) {
          this.set('errorMessageUpgrade', 'Document number is too long, make sure you include the letter without dashes');
        } else if (document.length < 9) {
          this.set('errorMessageUpgrade', 'Document number is too short, make sure you include the letter without dashes');
        }

        this.set('upgradeFailed', true);
        return;
      } else if (!/^[0-9]{8}[A-zÀ-ÿ]{1}$/.test(document)) {
        this.set('errorMessageUpgrade', 'Document number format is not correct, please provide a valid one');
        this.set('upgradeFailed', true);
        return;
      } else {
        var rem = parseInt(document.substring(0, 8)) % 23;
        var check = this.get('check');
        if (check[rem] !== document.charAt(8)) {
          this.set('errorMessageUpgrade', 'This document number does not exist, please provide a valid one');
          this.set('upgradeFailed', true);
          return;
        }
      }

      // validate mobile phone number
      var isValid = this.get('isValidNumber');
      if (!isValid) {
        this.set('errorMessageUpgrade', 'The phone number you have provided is not valid');
        this.set('upgradeFailed', true);
        return;
      }

      var number = this.get('number');
      Ember.$.ajax({
        type: 'POST',
        beforeSend: function(request) {
          request.setRequestHeader("Document", document);
          request.setRequestHeader("Mobile", number);
        },
        url: '/api/auth/upgrade',
        dataType: 'json',
        contentType: 'application/json'
      }).then(function() {}, function(data) {
        _this.set('document', '');
        _this.set('number', '');
        if (data.status === 200) {
          _this.set('madePhoneCall', true);
          _this.set('verification', data.responseText);
          alert("We will now make you a phone call, complete the verification number with the the phone call origin number");
        } else if (data.status === 412) {
          _this.set('madePhoneCall', true);
          alert("Your account upgrade phone called was already made, check your missing calls");
        } else {
          alert("Something went wrong, please try again later");
        }
      });
    },
    verify: function() {
      var _this = this;

      // make sure error message is hidden
      this.set('verificationFailed', false);

      var verification = Ember.$.trim(this.get('verification'));
      // remove dashes if present
      verification.replace("-", "");
      if (!/^[+][0-9]{11}$/.test(verification)) {
        this.set('errorMessageVerification', 'Verification number format is not correct, please provide a valid one');
        this.set('verificationFailed', true);
        return;
      }

      Ember.$.ajax({
        type: 'POST',
        beforeSend: function(request) {
          request.setRequestHeader("Verification", verification);
        },
        url: '/api/auth/upgrade/verification',
        dataType: 'json',
        contentType: 'application/json'
      }).then(function(data) {
        alert("Account upgraded successfully!");
        _this.set('madePhoneCall', false);
        _this.set('verification', '');

        // update token in store and current user object
        var session = JSON.parse(localStorage.getItem("ember_simple_auth:session"));
        session.secure.token = data.token;
        localStorage.setItem("ember_simple_auth:session", JSON.stringify(session));

        var token = JSON.parse(atob(_this.get('session').store._lastData.secure.token.split(".")[1]));
        var user = JSON.parse(token.sub.toString().replace(/\\/g, ''));
        _this.set('currentUser', user);

        _this.transitionToRoute('index');
      }, function(data) {
        if (data.status === 400) {
          _this.set('errorMessageVerification', 'Verification number is not correct, please check the number again');
          _this.set('verificationFailed', true);
        } else if (data.status === 412) {
          alert("Verification number expired, request a new one");
          _this.transitionToRoute('index');
        } else {
          alert("Something went wrong, please try again later");
        }
      });
    }
  }
});
