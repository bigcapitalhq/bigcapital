FROM redis:6.2.21

COPY --chown=redis:redis redis.conf /usr/local/etc/redis/redis.conf

CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]