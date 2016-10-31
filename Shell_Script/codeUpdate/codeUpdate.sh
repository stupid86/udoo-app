#!/bin/bash
echo "Code Update Start..."
sudo cp ./server/app.js /home/ubuntu/testWeb/udoo-rice
sudo cp ./server/main.js /home/ubuntu/testWeb/udoo-rice/public/javascripts/
sudo cp ./server/main.html /home/ubuntu/testWeb/udoo-rice/views/
sudo cp ./server/style.css /home/ubuntu/testWeb/udoo-rice/public/stylesheets
sudo cp ./std-alone/main.js /home/ubuntu/testWeb/udoo-rice/stand-alone-rice/public/javascripts/
sudo cp ./std-alone/main.html /home/ubuntu/testWeb/udoo-rice/stand-alone-rice/views

echo "[Server Codes] Update Start"
echo "app.js Update"
echo "main.js Update"
echo "main.html Update"
echo "style.css Update"
echo "[Server Codes] Update Complete"

echo "[Stand Alone] Codes Update Start"
echo "main.js Update"
echo "main.html Update"
echo "[Stand Alone] Codes Update Complete"

echo "[ All Code Update Complete ]"
sleep 4
