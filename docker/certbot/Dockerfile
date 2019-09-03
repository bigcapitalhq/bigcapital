FROM phusion/baseimage:0.9.19

COPY scripts /root/scripts/

RUN apt-get update
RUN apt-get install -y letsencrypt

ENTRYPOINT bash -c "bash /root/scripts/run-certbot.sh && sleep infinity"
