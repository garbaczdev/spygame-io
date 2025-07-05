#!/bin/sh
set -e

log() {
  log_type=$1
  message=$2
  timestamp=`date -Iseconds`  # ISO 8601 timestamp
  echo "[$timestamp][$log_type] $message"
}


log "INFO" "Removing cached build"
rm -rf ./build/* 

log "INFO" "Starting build"
npm run build

log "INFO" "Setting Permissions"
chown -R 1000:1000 /usr/src/app/build

log "INFO" "Build Successful"
