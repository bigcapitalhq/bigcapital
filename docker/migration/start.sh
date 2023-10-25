# Migrate the master system database.
./wait-for-it/wait-for-it.sh mysql:3306 -- node ./build/commands.js system:migrate:latest

# Migrate all tenants.
./wait-for-it/wait-for-it.sh mysql:3306 -- node ./build/commands.js tenants:migrate:latest