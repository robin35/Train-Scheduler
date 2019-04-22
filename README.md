# Train-Scheduler
README

TRAIN SCHEDULER

Thank you for visiting my repository. This project gives train administrators the ability to add train information to a Train Schedule table. Once added, the Train Schedule table can be updated in-line and any row can be deleted.

Here’s how it works:

    Initial Load:
    	Train information is stored in the Firebase Realtime Database.  
    	Any train information that has been previously pushed to the database will populate on the Train Schedule table upon document load.

    Adding Train information:
    	A user input form is located at the bottom of the screen.  
    	To add a train, the user populates each field in the form and clicks the "Submit" button.
    	Clicking the Submit button will load the information into Firebase and update the Train Schedule table displayed on the screen.
    	The Next Arrival and Minutes Away columns are re-calculated each minute and are relative to the current time.
    	The Current Time is conveniently displayed above the table for reference. The time is displayed each second.

    Editing Train information:
    	An Edit button is located to the far right of each row of the Train Schedule.  
    	Clicking the Edit button allows data in selected columns to be editable.  
    	Only the Train Name, Destination, and Frequency columns are editable.  
    	To edit a row, click the Edit button.  The table columns for the selected row will display the data in input fields that can be edited in-line.
    	When the edit button is clicked, it no longer is visible.  A Save butten then displays. 
    	Clicking the Save button will post the changes to the Firebase database and the page will be refreshed with the updated data.

    Deleting Train information:
    	A Delete button is located to the far right of each row of the Train Schedule.
    	To delete a row, click the Delete button.
    	Clicking the Delete button will delete the row from both the Train Schedule and the Firebase database.
    
This project is applicable to train administrators at a train station and is not for everyone.

Hope you enjoy this application.