import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('login');
  this.route('sign');
  this.route('upgrade');
  this.route('invalid');
  this.route('success');
  this.route('forgotten');
  this.route('reset');
});

export default Router;
