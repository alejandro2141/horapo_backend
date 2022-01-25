su postgres
cd /tmp
pg_dumpall > backupNew-10-13-2021

git add backupNew-10-13-2021
git commit -m ""
##in server final
sudo su postgres 
dropdb conmeddb02
psql conmeddb02 < backupNew-10-13-2021
psql -f backupNew-11-05-2021  postgres
