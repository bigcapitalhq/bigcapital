#!/bin/bash

for conf in /etc/nginx/templates/*.conf; do
  mv $conf "/etc/nginx/sites-available/"$(basename $conf) > /dev/null
done

for template in /etc/nginx/templates/*.template; do
  envsubst < $template > "/etc/nginx/sites-available/"$(basename $template)".conf"
done