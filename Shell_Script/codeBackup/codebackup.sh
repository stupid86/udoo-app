#!/bin/sh
echo "\nUI App Code Backup Start\n\n"

echo "======== Server Codes Backup Start"
if [ -f /home/ubuntu/testWeb/udoo-rice/app.js ];
then  
	sudo cp /home/ubuntu/testWeb/udoo-rice/app.js ./BackupCodes/server/app.js
	echo "= app.js Backup Complete\n"
else 
	echo "= app.js file not found\n" 
fi 

if [ -f /home/ubuntu/testWeb/udoo-rice/public/javascripts/main.js ]; 
then  
	sudo cp /home/ubuntu/testWeb/udoo-rice/public/javascripts/main.js ./BackupCodes/server/main.js
	echo "= main.js Backup Complete\n"
else 
	echo "= main.js file not found\n" 
fi

if [ -f /home/ubuntu/testWeb/udoo-rice/views/main.html ]; 
then  
	sudo cp /home/ubuntu/testWeb/udoo-rice/views/main.html ./BackupCodes/server/main.html
	echo "= main.html Backup Complete\n"
else 
	echo "= main.html file not found\n" 
fi

if [ -f /home/ubuntu/testWeb/udoo-rice/public/stylesheets/style.css ]; 
then  
	sudo cp /home/ubuntu/testWeb/udoo-rice/public/stylesheets/style.css ./BackupCodes/server/style.css
	echo "= style.css Backup Complete"
else 
	echo "= style.css file not found" 
fi
echo "======== Server Codes Backup End\n"

echo "======== Std Alone Codes Backup Start"
if [ -f /home/ubuntu/testWeb/udoo-rice/stand-alone-rice/public/javascripts/main.js ]; 
then  
	sudo cp /home/ubuntu/testWeb/udoo-rice/stand-alone-rice/public/javascripts/main.js ./BackupCodes/std-alone/main.js 
	echo "= main.js  Backup Complete\n"
else 
	echo "= main.js  file not found\n" 
fi

if [ -f /home/ubuntu/testWeb/udoo-rice/stand-alone-rice/views/main.html ]; 
then  
	sudo cp /home/ubuntu/testWeb/udoo-rice/stand-alone-rice/views/main.html ./BackupCodes/std-alone/main.html 
	echo "= main.html Backup Complete"
else 
	echo "= main.html file not found" 
fi
echo "======== Std Alone Codes Backup End"

echo "\nUI App Code Backup Complete\n\n"
echo "Thank you."
sleep 3
