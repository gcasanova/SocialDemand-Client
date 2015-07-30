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
  this.route('forum');

  this.route('forum-region', {
    path: '/forum/region/:region_id'
  });

  this.route('forum-region-province', {
    path: '/forum/region/:region_id/province/:province_id'
  });

  this.route('forum-region-province-municipality', {
    path: '/forum/region/:region_id/province/:province_id/municipality/:municipality_id'
  });

  this.route('forum-post', {
    path: '/forum/post/:post_id'
  });
});

export default Router;
