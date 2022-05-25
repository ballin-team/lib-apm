#!/bin/bash

## This bash script has the responsibility to analyze the project using sonarqube locally

PROJECT_DIR=$(pwd)
echo $PROJECT_DIR
echo "####### Starting code analysis #######"
docker run --network=host --rm -e SONAR_HOST_URL="http://localhost:9000" -v "$PROJECT_DIR:/usr/src" sonarsource/sonar-scanner-cli
echo "####### Code analysis completed #######"
