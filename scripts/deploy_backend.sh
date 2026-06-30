#!/bin/bash

ACCOUNT_ID=YOUR_ACCOUNT_ID
REGION=ap-south-1

aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

docker stop backend || true

docker rm backend || true

docker pull $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/backend:latest

docker run -d \
--name backend \
-p 5000:5000 \
$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/backend:latest