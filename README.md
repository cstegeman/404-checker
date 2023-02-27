# 404-checker

## Install dependencies

`yarn install`

## Define host or url

The script needs a url to index links and scan for 404 errors:
- Copy `.env.example` to `.env`
- Change the value for `HOST` to a url or domain of your choice

Don't just scan any random page, because scanning will impact server performance. This script can potentially bring a webserver on it's knees.

## Running the script

`yarn run check`
