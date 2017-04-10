import angular from 'angular';
import angularMeteor from 'angular-meteor';
import classes from '../imports/components/classes/classes';
import updates from '../imports/components/updates/updates';
<<<<<<< HEAD
//import search from '../imports/components/search/search';
=======
import inputReviews from '../imports/components/inputReviews/inputReviews';
>>>>>>> bd6b6742f9d86c8d450518db77af801fa6aa37b1

angular.module('classList', [
  angularMeteor,
  classes.name,
  updates.name
]);