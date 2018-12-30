defmodule TheDailyGrindClub.Repo do
  use Ecto.Repo,
    otp_app: :the_daily_grind_club,
    adapter: Ecto.Adapters.Postgres
end
