import angular from 'angular';
import angularMeteor from 'angular-meteor';
import gauges from 'angularjs-gauge';
import template from './updates.html';
import { Classes } from '../../api/classes.js';
import { Reviews } from '../../api/classes.js';

class UpdatesCtrl {
  constructor($scope) {
    $scope.viewModel(this);

    this.subscribe('reviews', () => [null, 0]);

    this.helpers({
      reviews() {
        return Reviews.find({});
      }
    })
  }

  //change the visibility of the clicked review
  makeVisible(review) {
    Reviews.update(review._id, {$set: { visible: 1} });
  }

  remove(review) {
    Reviews.remove({ _id: review._id});
  }
}
 
export default angular.module('update', [
  angularMeteor, 
  'angularjs-gauge'
])
  .component('update', {
    templateUrl: 'imports/components/updates/updates.html',
    controller: ['$scope', UpdatesCtrl]
  });