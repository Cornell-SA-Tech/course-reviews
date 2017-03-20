import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Classes } from '../../api/classes.js';
import template from './classes.html';
 
class ClassCtrl {
   constructor($scope) {
    $scope.viewModel(this);
 
    this.helpers({
      classes() {
        console.log("test");
        return Classes.find({});
      }
    })
  }

  // addTask(newTask) {
  //   // Insert a task into the collection
  //   Tasks.insert({
  //     text: newTask,
  //     createdAt: new Date
  //   });
 
  //   // Clear form
  //   this.newTask = '';
  // }
}
 
export default angular.module('classes', [
  angularMeteor
])
  .component('classes', {
    templateUrl: 'imports/components/classes/classes.html',
    controller: ['$scope', ClassCtrl]
  });