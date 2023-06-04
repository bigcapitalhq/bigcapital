#!/bin/bash

# chmod u+rwx /scripts/init.template.sql
cp /scripts/init.template.sql /scripts/init.sql

# Replace environment variables in SQL files with their values
if [ -n "$MYSQL_USER" ]; then
    sed -i "s/{MYSQL_USER}/$MYSQL_USER/g" /scripts/init.sql
fi
if [ -n "$MYSQL_PASSWORD" ]; then
    sed -i "s/{MYSQL_PASSWORD}/$MYSQL_PASSWORD/g" /scripts/init.sql
fi
if [ -n "$MYSQL_DATABASE" ]; then
    sed -i "s/{MYSQL_DATABASE}/$MYSQL_DATABASE/g" /scripts/init.sql
fi

# Execute SQL file
mysql -u root -p$MYSQL_ROOT_PASSWORD < /scripts/init.sql