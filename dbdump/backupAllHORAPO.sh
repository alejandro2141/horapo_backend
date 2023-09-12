#!/bin/bash
echo BACKUP ALL STARTED!


file_name=BACKUP_ALL_HORAPO.sql.
current_time=$(date "+%Y.%m.%d-%H.%M.%S")
new_fileName=$file_name.$current_time

sudo su postgres
pg_dumpall > /tmp/$new_fileName
exit 





