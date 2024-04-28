# Takes a backup of database Docker volume and compress into one .tar.gz
# file and upload to s3 package through s3cmd.
S3_BUCKET="s3://bigcapital-backup"

# Generate the current date and time formatted as YYYY-MM-DD-HH-MM-SS
CURRENT_DATETIME=$(date +"%Y-%m-%d-%H-%M-%S")

# Define the filename with the current date and time
FILE_NAME="bigcapital-mariadb-${CURRENT_DATETIME}.tar.gz"

# Create a sample file (replace this with your actual file creation process)
echo "This is a sample file created on ${CURRENT_DATETIME}" > "$FILE_NAME"

docker run --rm \
  --mount source=bigcapital_prod_mysql,target=/data/db \
  -v $(pwd):/backup \
  busybox \
  tar -czvf "/backup/$FILE_NAME" /data/db

# Upload the file to S3 using s3cmd
s3cmd put "$FILE_NAME" "$S3_BUCKET/"

# Remove the temporary file
rm "$FILE_NAME"
