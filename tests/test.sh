#!/bin/sh

export NODE_PATH=$(dirname $(readlink -fn $0))/node_modules

export \
    VAR1=Hello \
    VAR2=1,s,3,c \
    VAR3=false \
    VAR4=y \
    VAR5=5 \
    VAR6=1.3

node test.js -c test.yml
