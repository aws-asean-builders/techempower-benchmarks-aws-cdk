#!/bin/bash

yum update -y
amazon-linux-extras install docker

mkdir /etc/systemd/system/docker.service.d

echo "# /etc/systemd/system/docker.service.d/override.conf" >> /etc/systemd/system/docker.service.d/startup_options.conf
echo "[Service]" >> /etc/systemd/system/docker.service.d/startup_options.conf
echo "ExecStart= " >> /etc/systemd/system/docker.service.d/startup_options.conf
echo "ExecStart=/usr/bin/dockerd -H unix:// -H tcp://0.0.0.0:2375" >> /etc/systemd/system/docker.service.d/startup_options.conf

service docker start
usermod -a -G docker ec2-user