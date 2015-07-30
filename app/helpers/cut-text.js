import Ember from 'ember';

export function cutText(params/*, hash*/) {
  if (params[0].length > 300) {
    return params[0].substring(0, 300) + "...";
  }  else {
    return params[0];
  }
}

export default Ember.HTMLBars.makeBoundHelper(cutText);
