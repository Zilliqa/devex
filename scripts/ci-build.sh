#!/bin/bash

echo $(pwd)

docker --version
aws --version

echo $TRAVIS_COMMIT
commit=$(git rev-parse --short=7 $TRAVIS_COMMIT)

accountID=$(aws sts get-caller-identity --output text --query 'Account')
regionID=us-west-2
application=devex
registryURL="zilliqa/$application"

#eval "$(aws ecr get-login --no-include-email --region $regionID)"
echo "$DOCKER_API_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin

rm -rf devex-artifact
mkdir -p devex-artifact/stg/
mkdir -p devex-artifact/prd/

docker build --build-arg REACT_APP_DEPLOY_ENV="stg" -t "tempimagestg:$commit" .
docker create --name extractstg "tempimagestg:$commit"
docker cp extractstg:/usr/share/nginx/html/. $(pwd)/devex-artifact/stg/
docker rm extractstg

docker build --build-arg REACT_APP_DEPLOY_ENV="prd" -t "tempimageprd:$commit" -t "$registryURL:latest" -t "$registryURL:$commit" .
docker create --name extractprd "tempimageprd:$commit"
docker cp extractprd:/usr/share/nginx/html/. $(pwd)/devex-artifact/prd/
docker rm extractprd
docker push "$registryURL"

cd devex-artifact
cd stg
echo $commit > devex-artifact-commit.txt
#tar -czvf devex-artifact-stg.gz .
zip -r devex-artifact-stg.zip .
aws s3 sync . s3://devex-static-artifact --exclude='*' --include='devex-artifact-stg.zip'

cd ..
cd prd
echo $commit > devex-artifact-commit.txt
#tar -czvf devex-artifact-prd.gz .
zip -r devex-artifact-prd.zip .
aws s3 sync . s3://devex-static-artifact --exclude='*' --include='devex-artifact-prd.zip'

cd ..
echo $(date) > date_created.txt
aws s3 sync . s3://devex-static-artifact --exclude='*' --include='date_created.txt'
