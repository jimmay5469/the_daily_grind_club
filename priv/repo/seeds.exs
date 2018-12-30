# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     TheDailyGrindClub.Repo.insert!(%TheDailyGrindClub.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias TheDailyGrindClub.Athletes

Athletes.create_athlete(%{
  strava_id: 1234,
  first_name: "Jimmy",
  last_name: "Lauzau"
})
