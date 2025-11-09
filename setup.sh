
# Initialize the essential variables.
BRANCH=main
CURRENT=$PWD
BIGCAPITAL_INSTALL_DIR=$PWD/bigcapital-$(echo $BRANCH | sed -r 's@(\/|" "|\.)@-@g')
BIGCAPITAL_CLONE_TEMP_DIR=$(mktemp -d)
CPU_ARCH=$(uname -m)

DOCKER_FILE_PATH=./docker-compose.prod.yml

DOCKER_COMPOSE_DIR=docker
DOCKER_ENV_EXAMPLE_PATH=$CURRENT/.env.example
DOCKER_ENV_PATH=$CURRENT/.env

# if docker-compose is installed
if command -v docker-compose &> /dev/null
then
    COMPOSE_CMD="docker-compose"
else
    COMPOSE_CMD="docker compose"
fi

REPO=https://github.com/bigcapitalhq/bigcapital

# Prints the Bigcapital logo once running the script.
function print_logo() {
clear

cat <<"EOF"
--------------------------------------------
         ×      ≠≠≠≠   ____  _                       _ _        _ 
       ××××   ≠≠≠≠≠    | __ )(_) __ _  ___ __ _ _ __ (_) |_ __ _| |
     ×××××  ≠≠≠≠≠      |  _ \| |/ _` |/ __/ _` | '_ \| | __/ _` | |
   ×××××  ≠≠≠≠≠=       | |_) | | (_| | (_| (_| | |_) | | || (_| | |
 ×××××  ≠≠≠≠≠≠         |____/|_|\__, |\___\__,_| .__/|_|\__\__,_|_|
××××     ≠≠≠                    |___/          |_|                 
--------------------------------------------
Self-hosted modern core accounting software
--------------------------------------------
EOF
}

# Downloads /docker folder from Bigcapital repository
clone_github_folder() {
    # Create a temporary directory to clone into
    temp_dir=$BIGCAPITAL_CLONE_TEMP_DIR

    # Clone the repository
    git clone --branch=main --depth=1 "$1" "$temp_dir"
    echo "The repository has been cloned."

   DATE=$(date +%s) 

    if [ -f "$CURRENT/docker-compose.prod.yml" ]
    then
        mkdir -p $CURRENT/archive/$DATE
        mv $CURRENT/docker-compose.prod.yml $CURRENT/archive/$DATE/docker-compose.prod.yml
    fi

    if [ -d "$CURRENT/docker" ]
    then
        mkdir -p $CURRENT/archive/$DATE
        mv $CURRENT/docker $CURRENT/archive/$DATE/docker
    fi

    mv -f "$temp_dir/docker" "$CURRENT"
    mv -f "$temp_dir/docker-compose.prod.yml" "$CURRENT"
    mv -f "$temp_dir/.env.example" "$CURRENT/"

    # Cleanup temporary directory
    rm -rf "$temp_dir"
}


setup_env() {
    if [ -f $DOCKER_ENV_EXAMPLE_PATH ];
    then
        cp "$CURRENT/.env.example" "$DOCKER_ENV_PATH"
    fi

}
# Prints the main actions men.
function askForAction() {
    local DEFAULT_ACTION=$1

    if [ -z "$DEFAULT_ACTION" ];
    then
        echo
        echo "Select a Action you want to perform:"
        echo "   1) Install (${CPU_ARCH})"
        echo "   2) Start"
        echo "   3) Stop"
        echo "   4) Restart"
        echo "   5) Upgrade"
        echo "   6) Logs"
        echo "   7) Exit"
        echo 
        read -p "Action [2]: " ACTION

        until [[ -z "$ACTION" || "$ACTION" =~ ^[1-7]$ ]]; do
            echo "$ACTION: invalid selection."
            read -p "Action [2]: " ACTION
        done

        if [ -z "$ACTION" ];
        then
            ACTION=2
        fi
        echo
    fi

    if [ "$ACTION" == "1" ] || [ "$DEFAULT_ACTION" == "install" ]
    then
        install
        askForAction
    elif [ "$ACTION" == "2" ] || [ "$DEFAULT_ACTION" == "start" ]
    then
        startServices
        askForAction
    elif [ "$ACTION" == "3" ] || [ "$DEFAULT_ACTION" == "stop" ]
    then
        stopServices
        askForAction
    elif [ "$ACTION" == "4" ] || [ "$DEFAULT_ACTION" == "restart" ]
    then
        restartServices
        askForAction
    elif [ "$ACTION" == "5" ]  || [ "$DEFAULT_ACTION" == "upgrade" ]
    then
        upgrade
        askForAction
    elif [ "$ACTION" == "6" ]  || [ "$DEFAULT_ACTION" == "logs" ]
    then
        viewLogs $@
        askForAction "logs"
    elif [ "$ACTION" == "7" ] 
    then
        exit 0
    else
        echo "Error: Invalid given action"
    fi
}

function install() {
    echo "Installing Bigcaoital.........."
    echo "installing is going to take few mintues..."
    download
    setup_env
}

function download() { 
    # Download the docker/, docker-compose file and .env.example
    clone_github_folder "https://github.com/bigcapitalhq/bigcapital.git"

    /bin/bash -c "$COMPOSE_CMD -f $DOCKER_FILE_PATH --env-file=$DOCKER_ENV_PATH pull"

    echo ""
    echo "The stable version is now available for you to use"
    echo ""
}

function startServices() {
    /bin/bash -c "$COMPOSE_CMD -f $DOCKER_FILE_PATH --env-file=$DOCKER_ENV_PATH build"
    /bin/bash -c "$COMPOSE_CMD -f $DOCKER_FILE_PATH --env-file=$DOCKER_ENV_PATH up -d"

    local migrator_container_id=$(docker container ls -aq -f "name=bigcapital-database-migration")
    if [ -n "$migrator_container_id" ]; then
        local idx=0
        while docker inspect --format='{{.State.Status}}' $migrator_container_id | grep -q "running"; do
            local message=">> Waiting for database migration to finish"
            local dots=$(printf '%*s' $idx | tr ' ' '.')
            echo -ne "\r$message$dots"
            ((idx++))
            sleep 1
        done
    fi
    printf "\r\033[K"
    echo ""
    echo "   Database migration completed successfully ✅"

    # if migrator exit status is not 0, show error message and exit
    if [ -n "$migrator_container_id" ]; then
        local migrator_exit_code=$(docker inspect --format='{{.State.ExitCode}}' $migrator_container_id)
        if [ $migrator_exit_code -ne 0 ]; then
            echo "Bigcapital Server failed to start ❌"
            stopServices
            echo
            echo "Please check the logs for the 'migrator' service and resolve the issue(s)."
            echo "Stop the services by running the command: ./setup.sh stop"
            exit 1
        fi
    fi

    local api_container_id=$(docker container ls -q -f "name=bigcapital-server")
    local idx2=0
    while ! docker logs $api_container_id 2>&1 | grep -m 1 -i "Server listening on port" | grep -q ".";
    do
        local message=">> Waiting for Bigcapital Server to Start"
        local dots=$(printf '%*s' $idx2 | tr ' ' '.')    
        echo -ne "\r$message$dots"
        ((idx2++))
        sleep 1
    done
    printf "\r\033[K"
    echo "   API server started successfully ✅"
    source "${DOCKER_ENV_PATH}"
    echo "   Bigcapital server started successfully ✅"
    echo ""
    echo "   You can access the application at $WEB_URL"
    echo ""

}

# Stoppes all the Docker containers.
function stopServices() {
    /bin/bash -c "$COMPOSE_CMD -f $DOCKER_FILE_PATH --env-file=$DOCKER_ENV_PATH down"
}

# Restarts all the Docker containers.
function restartServices() {
    stopServices
    startServices
}

function viewLogs(){
    ARG_SERVICE_NAME=$2
        echo
        echo "Select a Service you want to view the logs for:"
        echo "   1) Webapp"
        echo "   2) API"
        echo "   3) Migration"
        echo "   4) Nginx Proxy"
        echo "   5) MariaDB"
        echo "   0) Back to Main Menu"
        echo 
        read -p "Service: " DOCKER_SERVICE_NAME

        until (( DOCKER_SERVICE_NAME >= 0 && DOCKER_SERVICE_NAME <= 5 )); do
            echo "Invalid selection. Please enter a number between 1 and 11."
            read -p "Service: " DOCKER_SERVICE_NAME
        done

        if [ -z "$DOCKER_SERVICE_NAME" ];
        then
            echo "INVALID SERVICE NAME SUPPLIED"
        else
            case $DOCKER_SERVICE_NAME in
                1) viewSpecificLogs "webapp";;
                2) viewSpecificLogs "server";;
                3) viewSpecificLogs "database_migration";;
                4) viewSpecificLogs "nginx";;
                5) viewSpecificLogs "mysql";;
                0) askForAction;;
                *) echo "INVALID SERVICE NAME SUPPLIED";;
            esac
        fi
}

function viewSpecificLogs(){
    local SERVICE_NAME=$1

    if /bin/bash -c "$COMPOSE_CMD -f $DOCKER_FILE_PATH ps | grep -q '$SERVICE_NAME'"; then
        echo "Service '$SERVICE_NAME' is running."
    else
        echo "Service '$SERVICE_NAME' is not running."
    fi

    /bin/bash -c "$COMPOSE_CMD -f $DOCKER_FILE_PATH logs -f $SERVICE_NAME"
}

function upgrade() {
    echo "***** STOPPING SERVICES ****"
    stopServices

    echo
    echo "***** DOWNLOADING STABLE VERSION ****"
    download

    echo "***** PLEASE VALIDATE AND START SERVICES ****"
}

mkdir -p $CURRENT/archive

# Display the header and run the actions menu.
print_logo
askForAction $@
