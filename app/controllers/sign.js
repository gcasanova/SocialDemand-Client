import Ember from 'ember';
import config from '../config/environment';
import GeoLocationMixin from 'social-demand-client/mixins/geolocation-mixin';

export default Ember.Controller.extend(GeoLocationMixin, {
  loginFailed: false,
  errorMessage: null,
  isInitialised: false,
  selectedRegion: null,
  selectedProvince: null,
  selectedMunicipality: null,
  provinces: null,
  municipalities: null,
  provincesEnabled: false,
  municipalitiesEnabled: false,
  init: function() {
    var _this = this;
    this._super();

    this.get('geolocation').start();
    Ember.run.later((function() {
      _this.get('geolocation').getGeoposition().then(function(geoposition) {
        _this.get('geolocation').stop();

        Ember.$.get('https://maps.googleapis.com/maps/api/geocode/json?', {
          latlng: geoposition.coords.latitude + "," + geoposition.coords.longitude
        }).then(function(data) {
          var addressLength = data.results[0].address_components.length;
          _this.findMunicipality(geoposition, data.results[0].address_components, 0, addressLength - 1, _this);
        }, function() {
          console.log("Google geolocation query failed");
          _this.set('isInitialised', true);
        });
      }, function() {
        console.log("Geolocation blocked!");
        _this.set('isInitialised', true);
      });
    }), 2000);
  },
  findMunicipality: function(geoposition, values, currentIndex, maxIndex, _this) {
    var value = values[currentIndex];
    if (value.types.indexOf("political") > -1) {
      _this.store.find('municipality', {
        name: value.long_name,
        longitude: geoposition.coords.longitude,
        latitude: geoposition.coords.latitude
      }).then(function(response) {
        // municipality found
        var municipality = response.get('firstObject')._data;
        // find all municipalities for this province
        _this.store.find('municipality', {
          provinceId: municipality.provinceId
        }).then(function(response) {
          _this.set('municipalities', response);
          _this.set('selectedMunicipality', municipality.id);
          _this.set('municipalitiesEnabled', true);
        });

        // get province details
        _this.store.find('province', municipality.provinceId).then(function(response) {
          var province = response._data;
          _this.set('selectedRegion', province.regionId);
          // find all provinces for this region
          _this.store.find('province', {
            regionId: province.regionId
          }).then(function(response) {
            _this.set('provinces', response);
            _this.set('selectedProvince', province.id);
            _this.set('provincesEnabled', true);

            _this.set('isInitialised', true);
          });
        });
      }, function() {
        if (currentIndex < maxIndex) {
          _this.findMunicipality(geoposition, values, currentIndex + 1, maxIndex, _this);
        } else {
          console.log("Municipality not found");
          _this.set('isInitialised', true);
        }
      });
    } else {
      if (currentIndex < maxIndex) {
        _this.findMunicipality(geoposition, values, currentIndex + 1, maxIndex, _this);
      } else {
        console.log("Municipality not found");
        _this.set('isInitialised', true);
      }
    }
  },
  findProvinces: function() {
    if (this.get('isInitialised')) {
      this.set('municipalities', null);
      this.set('selectedMunicipality', null);
      this.set('municipalitiesEnabled', false);

      this.set('provinces', null);
      this.set('selectedProvince', null);
      this.set('provincesEnabled', false);

      var regionId = this.get('selectedRegion');
      if (regionId > 0) {
        var _this = this;
        this.store.find('province', {
          regionId: regionId
        }).then(function(response) {
          _this.set('provinces', response);
          _this.set('provincesEnabled', true);
        });
      }
    }
  }.observes('selectedRegion'),
  findMunicipalities: function() {
    if (this.get('isInitialised')) {
      this.set('municipalities', null);
      this.set('selectedMunicipality', null);
      this.set('municipalitiesEnabled', false);

      var provinceId = this.get('selectedProvince');
      if (provinceId > 0) {
        var _this = this;
        this.store.find('municipality', {
          provinceId: provinceId
        }).then(function(response) {
          _this.set('municipalities', response);
          _this.set('municipalitiesEnabled', true);
        });
      }
    }
  }.observes('selectedProvince'),
  actions: {
    signup: function() {
      var _this = this;
      var data = this.getProperties('name', 'email', 'password', 'password2');

      if (this.get('selectedMunicipality') == null || this.get('selectedProvince') == null || this.get('selectedRegion') == null) {
        this.set('errorMessage', 'Location details are missing');
        this.set('loginFailed', true);
        return;
      }

      if (data.name == null || data.name.length === 0) {
        this.set('errorMessage', 'Please enter your name');
        this.set('loginFailed', true);
        return;
      } else if (data.name.length < 3 || data.name.length > 25) {
        this.set('errorMessage', 'Name should have between 3 and 25 characters');
        this.set('loginFailed', true);
        return;
      } else if (!/^[A-zÀ-ÿ ]*$/g.test(data.name)) {
        this.set('errorMessage', 'Name has invalid characters');
        this.set('loginFailed', true);
        return;
      }

      if (data.email == null) {
        this.set('errorMessage', 'Please enter an email');
        this.set('loginFailed', true);
        return;
      }

      var str = Ember.$.trim(data.password);
      if (str == null || str.length === 0) {
        this.set('errorMessage', 'Please enter a password');
        this.set('loginFailed', true);
        return;
      } else if (str.length < 8 || str.length > 20) {
        this.set('errorMessage', 'Password should have between 8 and 20 characters');
        this.set('loginFailed', true);
        return;
      } else if (!/^[A-Za-z0-9]+$/.test(str)) {
        this.set('errorMessage', 'Password can only contain alphanumeric characters');
        this.set('loginFailed', true);
        return;
      } else if (data.password !== data.password2) {
        this.set('errorMessage', 'Passwords do not match, please try again');
        this.set('loginFailed', true);

        this.set('password', '');
        this.set('password2', '');
        return;
      }

      var user = {
        name: data.name,
        email: data.email,
        password: data.password,
        municipalityId: this.get('selectedMunicipality')
      };

      Ember.$.ajax({
        type: 'POST',
        url: config.host + '/api/auth/signup',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(user)
      }).then(function() {}, function(data) {
        if (data.status === 200) {
          alert("Check out your email inbox, use the confirmation link and proceed to login");
          _this.transitionToRoute('index');
        } else if (data.status === 403) {
          alert("Email is already being used, try to login");
        } else if (data.status === 412) {
          alert("We have found your details but email verification is pending, check your email inbox");
        } else {
          alert("Something went wrong, please try again later");
        }
      });
    }
  }
});
