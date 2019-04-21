// =========================================================================================================================
// Initialize Firebase
// =========================================================================================================================

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDMtcyo-RWR25gZOpSjDvolce56R7cls8o",
  authDomain: "train-scheduler-625e0.firebaseapp.com",
  databaseURL: "https://train-scheduler-625e0.firebaseio.com",
  projectId: "train-scheduler-625e0",
  storageBucket: "train-scheduler-625e0.appspot.com",
  messagingSenderId: "428367444326"
};
firebase.initializeApp(config);

var firebaseData = firebase.database();


// =========================================================================================================================
// Global Variables
// =========================================================================================================================

// Schedule variables
var gTrainName = "";
var gDestination = "";
var gFirstTrainTime = 0;
var gFrequency = 0;

var train = [];

// Database variables
var dbRecordCount = 0;

// Time variables
var cTime = 0;
var cTotal = 0;
var fTotal = 0;
var fHoursToMinutes = 0;
var nextArrivalTime = 0;
var minutesAway = 0;





// =========================================================================================================================
// PUSH DATA TO FIREBASE REALTIME DATABASE
// =========================================================================================================================

// Event: Submit Button Clicked
 
$(".btn-primary").on("click", function(event) {
  event.preventDefault();

  console.log("this:", this);

  // Trim spaces from user input
  var trainName = $("#formGroupTrainName").val().trim();
  var destination = $("#formGroupDestination").val().trim();
  var firstTrainTime = $("#formGroupFirstTrainTime").val().trim();
  var frequency = $("#formGroupFrequency").val().trim();
  
  // Push user input to firebase database
  firebaseData.ref().push({
      trainName: trainName,
      destination: destination,
      firstTrainTime: firstTrainTime,
      frequency: frequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
});






// =========================================================================================================================
// Function: Parse First Train Time into Hours/Minutes using sustr()
// =========================================================================================================================

firstTrainToMinutes = function () {
  var fHours = 0;
  var fMinutes = 0;

  fHours = gFirstTrainTime.substr(0, 2);
  fMinutes = gFirstTrainTime.substr(3, 2);
  fHoursToMinutes = fHours * 60;
  fTotal = +fHoursToMinutes + +fMinutes;

  console.log("fHours:", fHours);
  console.log("fMinutes:", fMinutes);
  console.log("fHoursToMinutes:", fHoursToMinutes);
  console.log("fTotal:", fTotal);

}



// =========================================================================================================================
// Function: Parse Current Time into Hours/Minutes using Moment.js
// =========================================================================================================================

currentTimeToMinutes = function () {

var currentTimeMilitary = moment();
var cTime = moment(currentTimeMilitary).format("HH:mm");

var cHours = 0;
var cMinutes = 0;
var cHoursToMinutes = 0;

cHours = currentTimeMilitary.hours();
cMinutes = currentTimeMilitary.minutes();
cHoursToMinutes = cHours * 60;
cTotal = +cHoursToMinutes + +cMinutes;

console.log("cHours:", cHours);
console.log("cMinutes:", cMinutes);
console.log("cHoursToMinutes:", cHoursToMinutes);
console.log("cTotal:", cTotal);

// Current Time to UI
$(".currentTime").html("<p>Current Time: "+cTime+"</p>");



}


// =========================================================================================================================
// Function: Calculate Next Arrival Time and Minutes Away
// =========================================================================================================================

nextArrivalCalculation = function () {

  var minutesSinceFirst = cTotal - fTotal;
  var numberTrainRuns = Math.floor(minutesSinceFirst / gFrequency) + 1; // add 1 for next train
  var minutesSinceFirstToNext = numberTrainRuns * gFrequency;
  
  minutesAway = minutesSinceFirstToNext - minutesSinceFirst;
  
  console.log("minutesSinceFirst:",minutesSinceFirst);
  console.log("numberTrainRuns:",numberTrainRuns);
  console.log("minutesSinceFirstToNext:",minutesSinceFirstToNext);
  console.log("minutesAway:",minutesAway);

  var nextArrivalTimeHours = Math.floor( (+minutesSinceFirstToNext + +fHoursToMinutes)/60 ); 
  var nextArrivalTimeMinutes = minutesSinceFirstToNext % 60; // modulus

  nextArrivalTime = nextArrivalTimeHours+":"+nextArrivalTimeMinutes;

  console.log("nextArrivalTimeHours:",nextArrivalTimeHours);
  console.log("nextArrivalTimeMinutes:",nextArrivalTimeMinutes);
  console.log("nextArrivalTime:",nextArrivalTime);

  nextArrivalTime2 = moment(nextArrivalTime, 'HH:mm');
  console.log("nextArrivalTime2:",nextArrivalTime2);
}



// =========================================================================================================================
// GET DATA FROM FIREBASE REALTIME DATABASE
// =========================================================================================================================

firebaseData.ref().on("child_added", function(childSnapshot) {

  console.log("There are "+childSnapshot.numChildren()+" fields in the DB.");

  // Data from Firebase
  gTrainName = childSnapshot.val().trainName;
  gDestination = childSnapshot.val().destination;
  gFirstTrainTime = childSnapshot.val().firstTrainTime;
  gFrequency = childSnapshot.val().frequency;

  firstTrainToMinutes();
  currentTimeToMinutes();
  nextArrivalCalculation();

  // Train information to UI
  $(".tableBody").append("<tr class='r"+dbRecordCount+"'>" +
      "<td id='r"+dbRecordCount+"c"+1+"'>"+gTrainName+"</td>" +
      "<td id='r"+dbRecordCount+"c"+2+"'>"+gDestination+"</td>" +
      "<td id='r"+dbRecordCount+"c"+3+"'>"+gFrequency+"</td>" +
      "<td id='r"+dbRecordCount+"c"+4+"'>"+nextArrivalTime+"</td>" +
      "<td id='r"+dbRecordCount+"c"+5+"'>"+minutesAway+"</td>" +
    "</tr>");

  train.push ({ record: dbRecordCount, 
                  trainName: gTrainName,
                  destination: gDestination, 
                  firstTrainTime: gFirstTrainTime, 
                  frequency: gFrequency,
                  nextArrivalTime: nextArrivalTime, 
                  minutesAway: minutesAway 
  });

  dbRecordCount++;

  console.log("train: ", train);
  
  // Error Handler
  }, function(errorObject) {
    console.log("firebase return error: " + errorObject.code);
});



// =========================================================================================================================
// UPDATE TIME DISPLAY
// =========================================================================================================================

var timer;

var startTime = "00";
var endTime = "24";

while(cHours >= startTime || cHours <= endTime) {
  if(x > 23) {
      x = 0;
  }


function updateTime() {
  
  for (var i = 0; i < train.length; i++){
  
    gFirstTrainTime = train[i].firstTrainTime;
    gFrequency = train[i].frequency;

    console.log("gFirstTrainTime: ", gFirstTrainTime);
    console.log("gFrequency: ", gFrequency);
  
    firstTrainToMinutes();
    currentTimeToMinutes();
    nextArrivalCalculation();
  
    console.log("nextArrivalTime: ", nextArrivalTime);
    console.log("minutesAway: ", minutesAway);


    $("#r"+i+"c4").html(nextArrivalTime);
    $("#r"+i+"c5").html(minutesAway);


  }
  

    if( cTime > "24:00" ) {
      clearInterval(timer);
      return false;
  }
}

timer = setInterval( updateTime, 60000 );




    console.log(x + ":00");
    x = x + 1;
}
