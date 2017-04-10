import angular from 'angular';
import angularMeteor from 'angular-meteor';
import gauges from 'angularjs-gauge';
import { HTTP } from 'meteor/http'
import { Classes} from '../../api/classes.js';
import { Subjects } from '../../api/classes.js';
import template from './updates.html';

class UpdatesCtrl {
  constructor($scope) {
    $scope.viewModel(this);

    
    this.subscribe('classes', () => [null]);
 
  }

  //}
  //   // Insert a task into the collection
  //   Tasks.insert({
  //     text: newTask,
  //     createdAt: new Date
  //   });
 
  //   // Clear form
  //   this.newTask = '';
  // }
}




 
export default angular.module('update', [
  angularMeteor, 
  'angularjs-gauge'
])
  .component('update', {
    templateUrl: 'imports/components/updates/updates.html',
    controller: ['$scope', UpdatesCtrl]
  });