import { Mongo } from 'meteor/mongo';

export const Classes = new Mongo.Collection('classes');
export const Subjects = new Mongo.Collection('subjects');