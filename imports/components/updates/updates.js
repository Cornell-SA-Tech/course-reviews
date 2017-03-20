import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { HTTP } from 'meteor/http'
import { Classes } from '../../api/classes.js';
import template from './updates.html';

class UpdatesCtrl {
  constructor($scope) {
    $scope.viewModel(this);
    $scope.list = [];
    // this.helpers({
    //   classes() {
    //     return Classes.find({});
    //   }
    // })
  }

  addClasses() {
    HTTP.call("GET", "https://classes.cornell.edu/api/2.0/config/subjects.json?roster=SP17", function(error, response ) {
      // Handle the error or response here.
      if (error) {
        console.log("error");
        //return [{"status" : "fail"}];
      } else {
        var sub = response.data.data.subjects;
        var subjects = [];
        for (course in sub) {
          var parent = sub[course].value;
          console.log(parent);
          HTTP.call("GET", "https://classes.cornell.edu/api/2.0/search/classes.json?roster=SP17&subject="+ parent, function(error, response ) {
            if (error) {
              console.log("inner error");
            } else {
              //get resulting list of classes 
              //for each class
                //if class in the database
                  //update prereqs
                //else
                  //add to the database
                  //store in the list to display
              console.log("made it");
            }
          });
        }
        //return response.status;
      }
    });
  }
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
  angularMeteor
])
  .component('update', {
    templateUrl: 'imports/components/updates/updates.html',
    controller: ['$scope', UpdatesCtrl]
  });