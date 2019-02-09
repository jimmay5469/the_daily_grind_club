# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :the_daily_grind_club,
  ecto_repos: [TheDailyGrindClub.Repo]

# Configures the endpoint
config :the_daily_grind_club, TheDailyGrindClubWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "Pznt9xdMe6vXJfuylSMSABoJzlDgvbzl6fRL5jid+bL2m+/zcVOgFCX53giHNnNd",
  render_errors: [view: TheDailyGrindClubWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: TheDailyGrindClub.PubSub, adapter: Phoenix.PubSub.PG2]

config :the_daily_grind_club, TheDailyGrindClub.Scheduler,
  jobs: [
    {"*/15 * * * *", {TheDailyGrindClub.Strava, :fetch_all_activities, []}}
  ]

# Custom configuration
config :the_daily_grind_club, TheDailyGrindClub.Strava,
  backend: TheDailyGrindClub.Strava.StravaBackend

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
