defmodule TheDailyGrindClub.Strava do
  alias TheDailyGrindClub.Athletes
  alias TheDailyGrindClub.Athletes.Athlete

  @config Application.get_env(:the_daily_grind_club, __MODULE__)

  def fetch_all_activities do
    Athletes.list_athletes() |> Enum.each(&fetch_athlete_activities/1)
  end

  def fetch_athlete_activities(%Athlete{} = athlete) do
    athlete = @config[:backend].refresh_access_token(athlete)
    activities = @config[:backend].fetch_athlete_activities(athlete)
    update_athlete_activities(athlete, activities)
  end

  def update_athlete_activities(%Athlete{} = athlete, activities) when is_list(activities) do
    Athletes.update_athlete(athlete, %{
      activities: Poison.encode!(activities),
      last_fetch: NaiveDateTime.utc_now()
    })
  end

  def update_athlete_activities(%Athlete{} = athlete, _), do: nil

  def is_authorized?(access_token) do
    if @config[:backend].fetch_athlete(access_token)["clubs"] do
      @config[:backend].fetch_athlete(access_token)["clubs"]
      |> Stream.map(& &1["id"])
      |> Enum.member?(493_369)
    else
      false
    end
  end
end
