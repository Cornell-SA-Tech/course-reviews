import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Classes } from '../../api/classes.js';
import { Reviews } from '../../api/classes.js';
import gauges from 'angularjs-gauge';
import template from './classes.html';
import uiRouter from 'angular-ui-router'
 
class ClassCtrl {
  constructor($scope, $element) {
    $scope.viewModel(this);

    //check if a class was selected in the search
    this.selectedClass = {};
    this.isClassSelected = false;

    //just for testing 
    // this.selectedClass = {"classSub":"cs","classNum":"2110","classTitle":"Object-Oriented Programming and Data Structures","classPrereq":{},"classFull":"cs 2110 object-oriented programming and data structures","_id":"etEhj4w6HzXsuJPmy"} 
    // this.isClassSelected = true;

    //hold data inputed by user in the add review form
    this.newReview = {
      text: null,
      diff: null,
      quality: null,
      medGrade: null,
      atten: null
    }

    //hold search query
    this.query = "";

    this.isHome = true;

    //variables to hold gauge options. Gauge taken from https://ashish-chopra.github.io/angular-gauge/
    this.qual = 0;
    this.diff =0;
    this.grade = "-";

    // define the width and thickeness of the the gauges using javascript to grab the width of the bootstrap col elements holding each gauge
    // Need to make this run automatically when the window resizes 
    w = $("#gaugeHolder").width();
    console.log(w)

    if (w > 700) {
      this.gaugeWidth = w/3 - .08*w;
      this.gaugeThick = 14
      console.log("1")
    }
    else if (w > 400) {
      this.gaugeWidth = w - .70*w;
      this.gaugeThick = 12; 
      console.log("2")
    }
    else {
      this.gaugeWidth = w - .5*w;
      this.gaugeThick = 10; 
      console.log("3")
    }

    //attempt to make gauges auto resize - doens't work 
    // $(window).resize(function() {
    //   console.log(this.gaugeWidth)
    // });

    //when the query variable changes, update the published classes returned by the database
    this.subscribe('classes', () => [this.getReactively('query')]);

    //when a new class is selected, update the published reviews returned by the database. Also update the gauges
    this.subscribe('reviews', () => [(this.getReactively('selectedClass'))._id, 1], {
      //runs once the published collection has been updated
      onReady: function() {
        if (this.isClassSelected == true) { //will later need to check that the side window is open too
          //create initial variables
          var countGrade = 0;
          var countDiff = 0;
          var countQual = 0;
          var count = 0;

          //array to translate grades from numerical value
          var gradeTranslation = ["C-", "C", "C+", "B-", "B", "B-", "A-", "A", "A+"];

          //get all current reviews, which will now have only this class's reviews because of the updated publishing
          var allReviews = Reviews.find({
              class : (this.getReactively('selectedClass'))._id,
              visible : 1
            },
            {limit: 700}
          )
          
          //gather data on the reviews
          if (allReviews.fetch().length != 0) {
            allReviews.forEach(function(review) {
              count++;
              countGrade = countGrade + Number(review["grade"]);
              countDiff = countDiff + review["difficulty"];
              countQual = countQual + review["quality"];
            });

            console.log("calculated qual is", (countQual/count).toFixed(1));
            console.log("calculated diff is ", (countDiff/count).toFixed(1));
            //update the gauge variable values 
            this.qual = (countQual/count).toFixed(1);
            this.diff = (countDiff/count).toFixed(1);
            this.grade = gradeTranslation[Math.floor(countGrade/count) - 1];
          } else {
            console.log("first else")
            this.qual = 0;
            this.diff = 0;
            this.grade = "-";
          }
        } else {
          console.log("Second else")
            this.qual = 0;
            this.diff = 0;
            this.grade = "-";
        } 
      } 
    })

    this.helpers({
      classes() {
        return Classes.find({}, {limit: 20});
      },
      reviews() {
        return Reviews.find({});
      }        
    });
  }
  // Insert a new review to the collection. 
  addReview(review, classId) {
    if (review.text != null && review.diff != null && review.quality != null && review.medGrade != null && classId != undefined && classId != null) {
      //call insert function defined on the server to change the database for more security. Make it a varible to run syncronously.
      var justAVarToMakeThisSync = Meteor.call('insert', review, classId)

      //clear the review 
      this.newReview = {
        text: null,
        diff: null,
        quality: null,
        medGrade: null,
        atten: null
      }

      //give success message 
      return "Thanks! Your review is pending approval."
    }
  }

  /*Return values of the following color functions are given to 
  foreground-color attributes of the gauges (surrounded by {{}} to conver to a string) 
  or as a CSS object to sliders using the sliderStyler helper function. */

  //get color of the difficulty slider or gauge. 
  diffColor(value) {
    if (value <= 2) return '#53B227'
    else if (value >= 3.5) return '#E64458'
    else return '#F9CC30'
  }

  //get color of the qual slider or gauge 
  qualColor(value) {
    if (value <= 2) return '#E64458'
    else if (value >= 3.5) return '#53B227'
    else return '#F9CC30'
  }

  //color gauge conversion
  gradeColor(value) {
    var gradeTranslation = ["-", "C-", "C", "C+", "B-", "B", "B-", "A-", "A", "A+"]
    var colIndex = gradeTranslation.indexOf(value)
    if (colIndex <= 3) return '#E64458'
    else if (colIndex >= 7) return '#53B227'
    else return '#F9CC30'
  }

  //take color and return as a CSS styling object to pass to the slider 
  sliderStyle(color) {
    return {'background-color': color}
  }
}
 
export default angular.module('classes', [
  angularMeteor,
  uiRouter
])
  .component('classes', {
    templateUrl: 'imports/components/classes/classes.html',
    controller: ['$scope', ClassCtrl]
  })
  .config(config);

  function config($locationProvider, $urlRouterProvider){
    'ngInject';

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/classes');
  }