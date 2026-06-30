#!/bin/bash

ACCOUNT_ID=YOUR_ACCOUNT_ID
REGION=ap-south-1

aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

docker stop frontend || true

docker rm frontend || true

docker pull $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/frontend:latest

docker run -d \
--name frontend \
-p 80:80 \
$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/frontend:latest