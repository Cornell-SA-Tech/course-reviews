import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Classes } from '../../api/classes.js';
import gauges from 'angularjs-gauge';
import template from './classes.html';
 
class ClassCtrl {
  constructor($scope) {
    $scope.viewModel(this);

    this.query = "";
 
    this.subscribe('classes', () => [this.getReactively('query')]);
    
    this.helpers({
      classes() {
        return Classes.find({}, {limit: 20});
      }
    })
  }

}
 
export default angular.module('classes', [
  angularMeteor
])
  .component('classes', {
    templateUrl: 'imports/components/classes/classes.html',
    controller: ['$scope', ClassCtrl]
  });