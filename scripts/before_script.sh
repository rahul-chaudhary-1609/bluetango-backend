#!/bin/bash
set -x
echo "** bluexinga-backend-api-prod process status **" >> /tmp/bluexinga-backend-api-prod_deploy_logs
runuser -l ubuntu -c 'sudo pm2 status' | grep -wo bluexinga0
if [  $? -ne 0 ];
then
    echo "############################## pm2 not running #################################" >> /tmp/bluexinga-backend-api-prod_deploy_logs
else
    echo "############################## pm2 already running Deleting ####################" >> /tmp/bluexinga-backend-api-prod_deploy_logs
     runuser -l ubuntu -c 'sudo pm2 delete bluexinga0'
fi

rm -rf /home/ubuntu/bluexinga-backend

if [ ! -d /home/ubuntu/bluexinga-backend ]; then
runuser -l ubuntu -c 'mkdir -p /home/ubuntu/bluexinga-backend' >> /tmp/bluexinga-backend-prod_deploy_logs
fi