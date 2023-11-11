#!/bin/bash
WORK_PATH='/usr/projects/test-docker-vue-cli-front'
cd $WORK_PATH
echo '先清除老代码'
git reset --hard origin/main
git clean -f
echo '拉取最新代码'
git pull origin main
echo '编译'
npm run build
echo '开始执行构建'
docker build -t test-docker-vue-cli-front:1.0 .
echo '停止旧容器并删除旧容器'
docker stop test-docker-vue-cli-front-conatiner
docker rm test-docker-vue-cli-front-conatiner
echo '启动新容器'
docker container run -p 80:80 --name test-docker-vue-cli-front-conatiner -d test-docker-vue-cli-front:1.0
