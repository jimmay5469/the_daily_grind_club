#!/bin/bash

if [ $MIX_ENV="prod" ]; then
  mix deps.get --only prod
  mix compile
  cd assets && npm install && npm run deploy; cd -
  mix phx.digest
  mix ecto.setup
  PORT=4001 mix phx.server
else
  mix deps.get
  cd assets && npm install; cd -
  mix ecto.setup
  mix phx.server
fi
