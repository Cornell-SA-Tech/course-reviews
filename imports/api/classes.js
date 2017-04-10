import { Mongo } from 'meteor/mongo';
import { HTTP } from 'meteor/http';

export const Classes = new Mongo.Collection('classes');
export const Subjects = new Mongo.Collection('subjects');

if (Meteor.isServer) {
    // This code only runs on the server

    Meteor.publish('classes', function validClasses(searchString) {
	  	console.log(searchString);
	  	if (searchString != undefined && searchString != "") {
	  		console.log("query");
	  		//console.log(searchString);
	  		return Classes.find({'$or' : [ 
			  { 'classSub':{ '$regex' : `.*${searchString}.*`, '$options' : 'i' }},
			  { 'classNum':{ '$regex' : `.*${searchString}.*`, '$options' : 'i' } },
			  { 'classTitle':{ '$regex' : `.*${searchString}.*`, '$options' : 'i' }}]
			});
	  	} else {
	  		console.log("none");
	  		return Classes.find({});
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
				    if (Subjects.find({'classSub' : parent.value}).fetch() == []) {
				     	console.log("new subject: " + parent.value);
				        Subjects.insert({
				        	classSub : parent.value,
				        	fullSub: parent.descr
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
					        var check = Classes.find({'classSub' : courses[course].subject, 'classNum' : courses[course].catalogNbr}).fetch();
					        if (check.length == 0) {
					            console.log("new class: " + courses[course].subject + " " + courses[course].catalogNbr + "," + semesters[semester]);
					        	//insert new class with empty prereqs and reviews 
					        	Classes.insert({
					          		classSub : courses[course].subject,
					          		classNum : courses[course].catalogNbr, 
					          		classTitle : courses[course].titleLong,
					          		classprereq : {}, 
					          		classreviews : {}
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

  //run on mongo if needed before running meteor:
  //db.classes.remove({});
  //db.subjects.remove({});

  //COMMENT THIS OUT AFTER THE FIRST METEOR BUILD!!
  //initDB(true);
}