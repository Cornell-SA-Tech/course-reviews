import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { HTTP } from 'meteor/http'
import { Classes} from '../../api/classes.js';
import { Subjects } from '../../api/classes.js';
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
        // var subjects = [];
        for (course in sub) {
          var parent = sub[course];
          //if subject doesn't exist
          if (Subjects.find().fetch() == []) {
            //console.log("not here");
            Subjects.insert({
              classSub : parent.value,
              fullSub: parent.descr
            });
          } 
        
          //console.log(parent);
          //get all classes in this subject
          HTTP.call("GET", "https://classes.cornell.edu/api/2.0/search/classes.json?roster=SP17&subject="+ parent.value, function(error, response ) {
            if (error) {
              console.log("inner error");
            } else {
              //get resulting list of classes 
              courses = response.data.data.classes;

              //for each class
              for (course in courses) {
                //console.log(courses[course]);
                var result = Classes.find({classSub : parent.value, classNum : parseInt(courses[course].catalogNbr)}).fetch();
                if (result.length == 0) {
                  //insert new class
                  Classes.insert({
                    classSub : parent.value,
                    classNum : courses[course].catalogNbr, 
                    classTitle : courses[course].titleLong,
                    classprereq : {}, 
                    classreviews : {}
                  });
                  
                } else {
                  console.log("update class");
                }
              }
            }
          });
        }
        return response.status;
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