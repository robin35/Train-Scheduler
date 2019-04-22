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
var gTrainName;
var gDestination;
var gFirstTrainTime;
var gFrequency;
var gLastTrainTime;

var train = [];

// Database variables
var dbRecordCount = 0;

// Time variables
var nextArrivalTime;
var minutesAway;

var cTime;



// =========================================================================================================================
// SUBMIT BUTTON CLICKED: PUSH DATA TO FIREBASE REALTIME DATABASE
// =========================================================================================================================
 
$(".btn-primary").on("click", function(event) {
  event.preventDefault();

  console.log("this:", this);

  // Trim spaces from user input
  var trainName = $("#formGroupTrainName").val().trim();
  var destination = $("#formGroupDestination").val().trim();
  var firstTrainTime = $("#formGroupFirstTrainTime").val().trim();
  var frequency = $("#formGroupFrequency").val().trim();
  var lastTrainTime = $("#formGroupLastTrainTime").val().trim();
  
  // Push user input to firebase database
  firebaseData.ref().push({
      trainName: trainName,
      destination: destination,
      firstTrainTime: firstTrainTime,
      frequency: frequency,
      lastTrainTime: lastTrainTime,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
});



// =========================================================================================================================
// GET DATA FROM FIREBASE REALTIME DATABASE
// =========================================================================================================================

firebaseData.ref().on("child_added", function(childSnapshot) {

  console.log("Number of records in Firebase: "+childSnapshot.numChildren());

  // Data from Firebase
  gTrainName = childSnapshot.val().trainName;
  gDestination = childSnapshot.val().destination;
  gFirstTrainTime = childSnapshot.val().firstTrainTime;
  gFrequency = childSnapshot.val().frequency;
  
  nextArrivalCalculation();

  // Train information to UI
  $(".tableBody").append("<tr class='r"+dbRecordCount+"'>" +
      "<td id='r"+dbRecordCount+"c"+0+"'>"+gTrainName+"</td>" +
      "<td id='r"+dbRecordCount+"c"+1+"'>"+gDestination+"</td>" +
      "<td id='r"+dbRecordCount+"c"+2+"'>"+gFrequency+"</td>" +
      "<td id='r"+dbRecordCount+"c"+3+"'>"+nextArrivalTime+"</td>" +
      "<td id='r"+dbRecordCount+"c"+4+"'>"+minutesAway+"</td>" +

      "<td id='r"+dbRecordCount+"c"+5+"'>"+
        "<input type='button' class='actionBtn' id='eBtn_r"+dbRecordCount+"c"+5+"' onclick='editRow("+dbRecordCount+")' value='Edit'></td>" +

      "<td id='r"+dbRecordCount+"c"+6+"'>"+
        "<input type='button' class='actionBtn' id='sBtn_r"+dbRecordCount+"c"+6+"' onclick='saveRow("+dbRecordCount+")' value='Save'></td>" + 

      "<td id='r"+dbRecordCount+"c"+7+"'>"+
        "<input type='button' class='actionBtn' id='dBtn_r"+dbRecordCount+"c"+7+"' onclick='deleteRow("+dbRecordCount+")' value='Delete'></td>" +
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
 
  // Error Handler
  }, function(errorObject) {
    console.log("firebase return error: " + errorObject.code);
});



// =========================================================================================================================
// Function: Calculate Next Arrival Time and Minutes Away; Display current time using Moment.js
// =========================================================================================================================

nextArrivalCalculation = function () {

  // Current time converted to milliseconds
  var today = new Date();
  cTime = today;
  var cTimeMS = today.getTime();

  // Parse first train time into hours / minutes
  var fTimeParsed = gFirstTrainTime.split(":");  

  // First train time converted to milliseconds
  var fTrainTime = new Date();
  fTrainTime.setHours(fTimeParsed[0]);
  fTrainTime.setMinutes(fTimeParsed[1]);
  fTrainTime.setSeconds(0);
  fTime = fTrainTime;  
  var fTimeMS = fTime.getTime();

  // Calculate Next Arrival Time
  var frequencyMS = 1000 * 60 * gFrequency;  // convert frequency to milliseconds
  var totalRunTimeMS = cTimeMS - fTimeMS;  // calculate total train run time since first run (in milliseconds)
  var numberTrainRuns = totalRunTimeMS / frequencyMS;  // calculate total number of train runs for the day
  var numberTrainRunsRounded = Math.floor(numberTrainRuns) + 1; // round down number train runs; add 1 for next train
  var nextTrainMS = (frequencyMS * numberTrainRunsRounded) + fTimeMS;  // calculate next train time in milliseconds
  var nextArrivalDate = new Date(nextTrainMS);  // convert nextTrain to date format

  // Convert nextArrivalDate to Time
  var nextHours = nextArrivalDate.getHours();
  var nextMinutes = nextArrivalDate.getMinutes();
  
  if(nextHours < 10) {
    nextHours = '0' + nextHours;
  }

  if(nextMinutes < 10) {
    nextMinutes = '0' + nextMinutes;
  }
  
  nextArrivalTime = nextHours + ":" + nextMinutes; // Next Arrival Time to be displayed in UI


  // Calculate Minutes Away
  var minutesAwayMS = nextTrainMS - cTimeMS; // calculate train minutes away in milliseconds
  minutesAway = Math.round((minutesAwayMS / 1000) / 60);  // convert minutesAway from milliseconds to minutes


/*
  console.log("cTime:",cTime);
  console.log("fTime:",fTime);
  console.log("fTimeParsed:",fTimeParsed);
  
  console.log("cTimeMS:",cTimeMS);
  console.log("fTimeMS:",fTimeMS);

  console.log("totalRunTimeMS:",totalRunTimeMS);
  console.log("numberTrainRuns:",numberTrainRuns);
  console.log("numberTrainRunsRounded:",numberTrainRunsRounded);

  console.log("nextTrainMS:",nextTrainMS);
  console.log("nextArrivalTime:",nextArrivalTime);
  console.log("minutesAwayMS:",minutesAwayMS);
  console.log("minutesAway:",minutesAway);
*/
}



// =========================================================================================================================
// EDIT TABLE ROW
// =========================================================================================================================

editRow = function (num) {
   
  var eTrainName = document.getElementById("r"+num+"c0");
  var eDestination = document.getElementById("r"+num+"c1");
  var eFrequency = document.getElementById("r"+num+"c2");
  
  var eTrain = eTrainName.innerHTML;
  var eDest = eDestination.innerHTML;
  var eFreq = eFrequency.innerHTML;
  
  eTrainName.innerHTML   = "<input type='text' id='e_r"+num+"c0' value='"+eTrain+"'>";
  eDestination.innerHTML = "<input type='text' id='e_r"+num+"c1' value='"+eDest+"'>";
  eFrequency.innerHTML   = "<input type='text' id='e_r"+num+"c2' value='"+eFreq+"'>";
 
}



// =========================================================================================================================
// SAVE TABLE ROW
// =========================================================================================================================

saveRow = function (num) {
  
  var sTrain = document.getElementById("e_r"+num+"c0").value;
  var sDest  = document.getElementById("e_r"+num+"c1").value;
  var sFreq  = document.getElementById("e_r"+num+"c2").value;
  
  document.getElementById("r"+num+"c0").innerHTML = sTrain;
  document.getElementById("r"+num+"c1").innerHTML = sDest;
  document.getElementById("r"+num+"c2").innerHTML = sFreq;

}



// =========================================================================================================================
// DELETE TABLE ROW
// =========================================================================================================================

deleteRow = function (num) {

  console.log("num:", num);

  document.getElementById("tableId").deleteRow(num);

}



// =========================================================================================================================
// UPDATE TRAIN SCHEDULE EACH MINUTE / UPDATE TIME DISPLAY EACH SECOND
// =========================================================================================================================

var minuteTimer;

function updateSchedEachMinute() {

  for (var i = 0; i < train.length; i++){
  
    gFirstTrainTime = train[i].firstTrainTime;
    gFrequency = train[i].frequency;

    nextArrivalCalculation();
  
    $("#r"+i+"c3").html(nextArrivalTime);
    $("#r"+i+"c4").html(minutesAway);


  }
  
}

minuteTimer = setInterval( updateSchedEachMinute, 60000 );


// =========================================================================================================================
// Function: Display current time formatted using Moment.js
// =========================================================================================================================
var secondTimer;

function updateTimeEachSecond() {
  // Display current time using Moment.js
  var currentTimeMilitary = moment();
  var cTime = moment(currentTimeMilitary).format("HH:mm:ss");
  $(".currentTime").html("<p>Current Time: "+cTime+"</p>");  // Current Time to UI
}
  secondTimer = setInterval( updateTimeEachSecond, 1000 );






