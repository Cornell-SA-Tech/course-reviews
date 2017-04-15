import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Classes } from '../../api/classes.js';
import { Reviews } from '../../api/classes.js';
import gauges from 'angularjs-gauge';
import template from './classes.html';
 
class ClassCtrl {
  constructor($scope) {
    $scope.viewModel(this);

    this.selectedClass = {};
    this.isClassSelected = false;

    this.newReview = {
      text: null,
      diff: null,
      quality: null,
      medGrade: null,
      atten: null
    }

    this.query = "";
 
    this.subscribe('classes', () => [this.getReactively('query')]);
    this.subscribe('reviews', () => [this.getReactively('selectedClass')._id]);
    this.helpers({
      classes() {
        return Classes.find({}, {limit: 20});
      },
      reviews() {
        return Reviews.find({});
      }
    })
  }

  // Insert a new review to the collection. NO SECURITY
  addReview(review, classId) {
    console.log(review);
    console.log(classId);
    if (review.text != null && review.diff != null && review.quality != null && review.medGrade != null && classId != undefined && classId != null) {
      Reviews.insert({
        text: review.text,
        difficulty: review.diff,
        quality: review.quality,
        class: classId,
        grade: review.medGrade,
        date: new Date()
      });

      //clear the review 
      this.newReview = {
        text: null,
        diff: null,
        quality: null,
        medGrade: null,
        atten: null
      }
    }
  }
}
 
export default angular.module('classes', [
  angularMeteor
])
  .component('classes', {
    templateUrl: 'imports/components/classes/classes.html',
    controller: ['$scope', ClassCtrl]
  });