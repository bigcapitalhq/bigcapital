#!/bin/bash

for conf in /etc/nginx/templates/*.conf; do
    mv $conf "/etc/nginx/sites-available/"$(basename $conf) > /dev/null
done

for template in /etc/nginx/templates/*.template; do
    envsubst < $template > "/etc/nginx/sites-available/"$(basename $template)".conf"
done

if [[ "$NO_DEFAULT" = true ]]; then
    rm /etc/nginx/sites-available/node.template.conf
    rm /etc/nginx/sites-available/node-https.template.conf
else
    if [[ "$WEB_SSL" = false ]]; then
        rm /etc/nginx/sites-available/node-https.template.conf
    fi
fi

. /root/scripts/run-openssl.sh