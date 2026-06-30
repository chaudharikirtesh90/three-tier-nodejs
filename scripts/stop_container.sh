#!/bin/bash

docker stop backend || true
docker stop frontend || true

docker rm backend || true
docker rm frontend || true