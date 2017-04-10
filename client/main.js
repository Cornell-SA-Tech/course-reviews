import angular from 'angular';
import angularMeteor from 'angular-meteor';
import classes from '../imports/components/classes/classes';
import updates from '../imports/components/updates/updates';

angular.module('classList', [
  angularMeteor,
  classes.name,
  updates.name
]);