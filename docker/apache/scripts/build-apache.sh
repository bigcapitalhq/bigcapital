#!/bin/bash

for conf in /usr/local/apache2/templates/*.conf; do
    mv $conf "/usr/local/apache2/sites-available/"$(basename $conf) > /dev/null
done

for template in /usr/local/apache2/templates/*.template; do
    mv $template "/usr/local/apache2/sites-available/"$(basename $template)".conf" > /dev/null
done

if [[ "$NO_DEFAULT" = true ]]; then
    rm /usr/local/apache2/sites-available/node.template.conf
    rm /usr/local/apache2/sites-available/node-https.template.conf
else
    if [[ "$WEB_SSL" = false ]]; then
        rm /usr/local/apache2/sites-available/node-https.template.conf
    fi
fi

. /root/scripts/run-openssl.sh