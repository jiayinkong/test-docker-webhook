#!/bin/bash
WORK_PATH='/usr/prjects/test-docker-back'
cd $WORK_PATH
echo '先清除代码'
git reset --hard origin/main
git clean -f
echo '拉取最新代码'
git pull origin main
echo '开始执行构建'
docker build -t test-docker-back .
echo '停止旧容器并删除旧容器'
docker stop test-docker-back-conatiner
docker rm test-docker-back-container
echo '启动新容器'
docker container run -p 3000:3000 --name test-docker-back-container -d test-docker-back
