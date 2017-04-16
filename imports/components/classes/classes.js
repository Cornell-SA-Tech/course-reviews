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

    //gauge options https://ashish-chopra.github.io/angular-gauge/
    this.qual = 0;
    this.diff =0;
    this.grade = "-";

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

  //update the values of the gauges when a class is selected
  updateGauges() {
    if (this.isClassSelected == true) {
      //reviews will have only this class's reviews because of the subscribe
      var countGrade = 0;
      var countDiff = 0;
      var countQual = 0;
      var count =0;
      var gradeTranslation = ["C-", "C", "C+", "B-", "B", "B-", "A-", "A", "A+"];

      var allReviews = Reviews.find({});
      console.log(allReviews);
      if (allReviews.fetch() != []) {
        allReviews.forEach(function(review) {
          count++;
          countGrade = countGrade + Number(review["grade"]);
          countDiff = countDiff + review["difficulty"];
          countQual = countQual + review["quality"];
        });

        // console.log(countQual);
        // console.log(countDiff);
        // console.log(countGrade);

        // console.log((countQual/count).toFixed(1));
        // console.log((countDiff/count).toFixed(1));
        // console.log(Math.floor(countGrade/count) - 1);
        this.qual = (countQual/count).toFixed(1);
        this.diff = (countDiff/count).toFixed(1);
        this.grade = gradeTranslation[Math.floor(countGrade/count) - 1];
      } else {
        this.qual = 0;
        this.diff = 0;
        this.grade = "-";
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