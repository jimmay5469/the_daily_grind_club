defmodule TheDailyGrindClub.Strava do
  alias TheDailyGrindClub.Athletes
  alias TheDailyGrindClub.Athletes.Athlete

  @config Application.get_env(:the_daily_grind_club, __MODULE__)

  def fetch_all_activities do
    Athletes.list_athletes() |> Enum.each(&fetch_athlete_activities/1)
  end

  def fetch_athlete_activities(%Athlete{} = athlete) do
    activities = @config[:backend].fetch_athlete_activities(athlete)
    update_athlete_activities(athlete, activities)
  end

  def update_athlete_activities(%Athlete{} = athlete, activities) do
    Athletes.update_athlete(athlete, %{
      activities: Poison.encode!(activities),
      last_fetch: NaiveDateTime.utc_now()
    })
  end

  def is_authorized?(%Athlete{} = athlete) do
    @config[:backend].fetch_athlete(athlete)["clubs"]
    |> Stream.map(& &1["id"])
    |> Enum.member?(493_369)
  end
end
