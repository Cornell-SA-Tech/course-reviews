import angular from 'angular';
import angularMeteor from 'angular-meteor';
import gauges from 'angularjs-gauge';
import template from './updates.html';
import { Classes } from '../../api/classes.js';
import { Reviews } from '../../api/classes.js';
import uiRouter from 'angular-ui-router';

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
    //Reviews.update(review._id, {$set: { visible: 1} });
    Meteor.call('makeVisible', review)
  }

  remove(review) {
    //Reviews.remove({ _id: review._id})
    Meteor.call('removeReview', review)
  }

  getNewSemester() {
    //call the database updating function in api/classes
    Meteor.call('addNewSemester', true);
  }
}
 
export default angular.module('update', [
  angularMeteor, 
  'angularjs-gauge',
  uiRouter
])
  .component('update', {
    templateUrl: 'imports/components/updates/updates.html',
    controller: ['$scope', UpdatesCtrl]
  })
  .config(config);

  function config($stateProvider){
    'ngInject';
    $stateProvider.state('update', {
      url: '/update',
      template: '<update></update>'
    })
  }