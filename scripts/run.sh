#!/bin/bash

. ~/.asdf/asdf.sh

cd ~/apps/the_daily_grind_club

export MIX_ENV=prod

git fetch
git reset --hard origin/master

export KERL_CONFIGURE_OPTIONS="--disable-debug --without-javac"
export NODEJS_CHECK_SIGNATURES="no"
asdf install # erlang
asdf install # everything else

mix local.hex --if-missing --force
mix local.rebar --if-missing --force
mix deps.get --only "$MIX_ENV"

mix compile

cd assets && npm install && npm run deploy; cd -
mix phx.digest

mix ecto.setup

PORT=4001 mix phx.server
