#!/bin/bash

adduser --disabled-password --gecos "" deploy
usermod -aG sudo deploy
ufw allow OpenSSH
ufw allow http
ufw allow https
ufw --force enable
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
