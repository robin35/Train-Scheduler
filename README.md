# Train-Scheduler
README

TRAIN SCHEDULER

Thank you for visiting my repository. This project gives train administrators the ability to add train information to a table. 

Here’s how it works:

    Initial Load:
    	Train information is stored in the Firebase Realtime Database.  Any trains that have been previously pushed to the database will load.


    Adding Train information:
    	A user input form is located at the bottom of the screen.  
    	To add a train, the user populates each field in the form and clicks the "Submit" button.
    	Clicking the Submit button will load the information into Firebase and update the train information displayed on the screen.
    	The time the next train will arrive and the minutes until arrival are calculated each minute and are relative to the current time.
    
This project is applicable to train administrators at a train station and is not for everyone.

Hope you enjoy this application.