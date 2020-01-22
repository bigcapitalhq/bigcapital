MYSQL_USER="ratteb"
MYSQL_DATABASE="ratteb"
MYSQL_CONTAINER_NAME="ratteb_test"

MYSQL_ROOT_PASSWORD="root"
MYSQL_PASSWORD="root"

echo "Start the testing MySql database..."

docker \
  run \
    --detach \
    --env MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD} \
    --env MYSQL_USER=${MYSQL_USER} \
    --env MYSQL_PASSWORD=${MYSQL_PASSWORD} \
    --env MYSQL_DATABASE=${MYSQL_DATABASE} \
    --name ${MYSQL_CONTAINER_NAME} \
    --publish 3306:3306 \
    --tmpfs /var/lib/mysql:rw \
  mysql:5.7;

echo "Sleeping for 10 seconds to allow time for the DB to be provisioned:"
for i in `seq 1 10`;
do
  echo "."
  sleep 1
done

echo "Database '${MYSQL_DATABASE}' running."
echo "  Username: ${MYSQL_USER}"
echo "  Password: ${MYSQL_PASSWORD}"
