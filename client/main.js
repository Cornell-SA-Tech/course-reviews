import angular from 'angular';
import angularMeteor from 'angular-meteor';
import classes from '../imports/components/classes/classes';

angular.module('classList', [
  angularMeteor,
  classes.name
]);