import { Mongo } from 'meteor/mongo';
import { HTTP } from 'meteor/http';
//import { SimpleSchema } from 'meteor/simpleschema';

//define database objects
export const Classes = new Mongo.Collection('classes');
Classes.schema = new SimpleSchema({
  _id: {type: String},
  classSub: {type: String},
  classNum: {type: Number},
  classTitle: {type: String},
  classAtten: {type: Number},
  classPrereq : { type: [String] ,optional: true},
  classFull: {type: String} 
  //classreviews : {type: [String] ,optional: true} // maybe [Object?]
});

export const Subjects = new Mongo.Collection('subjects');
Subjects.schema = new SimpleSchema({
	_id: {type: String},
	subShort : {type: String},
	subFull: {type: String}
});

export const Reviews = new Mongo.Collection('reviews');
Reviews.schema = new SimpleSchema({
	_id: {type: String},
	user: {type: String},
	text: {type: String,optional: true},
	difficulty: {type: Number},
	quality: {type: Number},
 	class: {type: String}, //ref to classId
 	grade: {type: Number},
 	date: {type: Date}
});

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.startup(() => {
	  // code to run on server at startup

	  //add indexes
	  Classes._ensureIndex(
	        { 'classSub' : 1 },
	        { 'classNum' : 1 },
	        { 'classTitle' : 1 }
	    );
	  Subjects._ensureIndex(
	  		{ 'subShort' : 1 },
	        { 'subFull' : 1 }
	  	);
	  Reviews._ensureIndex(
	    	{ 'class' : 1},
	    	{ 'difficulty' : 1 },
	    	{ 'quality' : 1 },
	    	{ 'grade' : 1 },
	    	{ 'user' : 1 }
	  	);
	});

    //publish visible classes based on search query
    Meteor.publish('classes', function validClasses(searchString) {
	  	console.log(searchString);
	  	if (searchString != undefined && searchString != "") {
	  		console.log("query");
	  		return Classes.find({'$or' : [ 
			  { 'classSub':{ '$regex' : `.*${searchString}.*`, '$options' : '-i' }},
			  { 'classNum':{ '$regex' : `.*${searchString}.*`, '$options' : '-i' } },
			  { 'classTitle':{ '$regex' : `.*${searchString}.*`, '$options' : '-i' }},
			  { 'classFull':{ '$regex' : `.*${searchString}.*`, '$options' : '-i' }}]

			}, 
			{limit: 700});
	  	} else {
	  		console.log("none");
	  		return Classes.find({},
	  		{limit: 700}); 
	  	}
  	});

    //publish visible reviews based on selected course 
	Meteor.publish('reviews', function validReviews(courseId) {
	  	console.log(courseId);
	  	if (courseId != undefined && courseId != "") {
	  		console.log("a class");
	
	  		return Reviews.find({class : courseId},  
			{limit: 700});
	  	} else {
	  		console.log("no class");
	  		return Reviews.find({}); 
	  	}
  	});

    //adds all classes and subjects to the db
    function initDB(bool) {
  		//clear the existing db
	    //get classes in each of the following semesters
	    var semesters = ["SP17", "SP16", "SP15","FA17", "FA16", "FA15"];
		for (semester in semesters) {
			//get all classes in this semester
		    var result = HTTP.call("GET", "https://classes.cornell.edu/api/2.0/config/subjects.json?roster=" + semesters[semester], {timeout: 30000});
		    if (result.statusCode != 200) {
		      console.log("error");
		    } else {
			  	response = JSON.parse(result.content);
			  	//console.log(response);
				var sub = response.data.subjects;
				for (course in sub) {
				    parent = sub[course];
				    //if subject doesn't exist add to Subjects
				    checkSub = Subjects.find({'subShort' : (parent.value).toLowerCase()}).fetch(); 
				    console.log(checkSub);
				    if (checkSub.length == 0) {
				     	console.log("new subject: " + parent.value);
				        Subjects.insert({
				        	subShort : (parent.value).toLowerCase(),
				        	subFull : parent.descr
				        });
				    } 
				  
				    //for each subject, get all classes in that subject for this semester
				    var result2 = HTTP.call("GET", "https://classes.cornell.edu/api/2.0/search/classes.json?roster=" + semesters[semester] + "&subject="+ parent.value, {timeout: 30000});
				    if (result2.statusCode != 200) {
				    	console.log("error2");
				    } else {
				    	response2 = JSON.parse(result2.content);
					    courses = response2.data.classes;

					    //add each class if it doesnt exist already
					    for (course in courses) {
					        var check = Classes.find({'classSub' : (courses[course].subject).toLowerCase(), 'classNum' : courses[course].catalogNbr}).fetch();
					        if (check.length == 0) {
					            console.log("new class: " + courses[course].subject + " " + courses[course].catalogNbr + "," + semesters[semester]);
					        	//insert new class with empty prereqs and reviews 
					        	Classes.insert({
					          		classSub : (courses[course].subject).toLowerCase(),
					          		classNum : courses[course].catalogNbr, 
					          		classTitle : courses[course].titleLong,
					          		classPrereq : {}, 
					          		classFull: (courses[course].subject).toLowerCase() + " " + courses[course].catalogNbr +" " + courses[course].titleLong.toLowerCase()
					       		});
					     	} else {
					        	console.log("update class " + courses[course].subject + " " + courses[course].catalogNbr + "," + semesters[semester]);
					      	}
					    }
				    }
				}
			} 
		}
	}

    //similar to above, but for a new semester. Run once the new semester data has been released.
    function addNewSemester() {

    }

  //COMMENT THESE OUT AFTER THE FIRST METEOR BUILD!!
  //Classes.remove({});
  //Subjects.remove({});
  //initDB(true);
}