#!/bin/bash
sudo su postgres

timestamp=$(date +"%Y-%m-%d_%H-%M-%S")
echo "BACKUP STARTING database 123HORA Backend  ".$timestamp

pg_dumpall > /tmp/123horaDBbackup.$timestamp
exit
cp /tmp/123horaDBbackup.$timestamp  ./

echo "BACKUP TASK END"




