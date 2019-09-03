FROM httpd:2.4

# openssl not installed in image
RUN apt-get update && apt-get install openssl

RUN mkdir /usr/local/apache2/templates \
	&& mkdir /usr/local/apache2/sites-available \
	&& rm /usr/local/apache2/conf/httpd.conf \
	&& rm /usr/local/apache2/conf/extra/*.conf

COPY httpd.conf /usr/local/apache2/conf/httpd.conf

COPY scripts /root/scripts/
COPY certs /etc/ssl/

COPY sites /usr/local/apache2/templates

ARG WEB_REVERSE_PROXY_PORT=8000
ARG WEB_SSL=false
ARG SELF_SIGNED=false
ARG NO_DEFAULT=false

ENV WEB_REVERSE_PROXY_PORT=$WEB_REVERSE_PROXY_PORT
ENV WEB_SSL=$WEB_SSL
ENV SELF_SIGNED=$SELF_SIGNED
ENV NO_DEFAULT=$NO_DEFAULT

RUN /bin/bash /root/scripts/build-apache.sh

CMD ["apachectl", "-D", "FOREGROUND"]
