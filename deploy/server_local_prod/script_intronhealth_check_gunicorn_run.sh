#!/usr/bin/env bash
#sudo lsof -i -P -n | grep gunicorn | grep 3000
ps ax | grep gunicorn | grep 3000
