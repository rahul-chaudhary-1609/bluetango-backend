#!/bin/bash
set -x
chown -R ubuntu:ubuntu /home/ubuntu/bluexinga-backend/

echo  "***Installing npm package ***" >> /tmp/bluexinga-backend-api-prod_deploy_logs
echo >> /tmp/bluexinga-backend-api-prod_deploys_logs
runuser -l ubuntu -c 'cd /home/ubuntu/bluexinga-backend && npm install'
runuser -l ubuntu -c 'cd /home/ubuntu/bluexinga-backend && npm install --unsafe-perm'
sleep 10
echo "***starting bluexinga0-backend-admin-api-prod application ***" >> /tmp/bluexinga-backend-api-prod_deploy_logs
runuser -l ubuntu -c 'cd /home/ubuntu/bluexinga-backend && sudo pm2 start dist/app.js --name bluexinga0  --silent' >> /tmp/bluexinga-backend-api-prod_deploy_logs

s1=`pm2 status | grep -we bluexinga0 | awk '{print $12}'`
sleep 5
s2=`pm2 status | grep -we bluexinga0 | awk '{print $12}'`
if [ $s1 == $s2 ]
then
echo "BUILD SUCCESSFUL" >> /tmp/bluexinga-backend-api-prod_deploy_logs
echo >> /tmp/bluexinga-backend-api-prod_deploy_logs
else
echo "Node process is restarting" >> /tmp/bluexinga-backend-api-prod_deploy_logs
echo >> /tmp/bluexinga-backend-api-prod_deploy_logs
fi