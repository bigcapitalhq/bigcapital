
# Store the backup.
docker run --rm \
  --mount source=bigcapital_dev_mysql,target=/data/db \
  -v $(pwd):/backup \
  busybox \
  tar -xzvf /backup/bigcapital-mariadb-2024-04-24-15-14-40.tar.gz -C /