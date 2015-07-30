import Ember from 'ember';

export default Ember.Controller.extend({
  init: function() {
    // find all regions
    this.store.find('region').then(function(response) {
      var html = '';
      response.forEach(function(region) {
        html += '<li><a href="forum/region/' + region._data.id + '">' + region._data.name + '</a></li>';
      });
      Ember.$('#regions-dropdown').html(html);
    });
  }
});
