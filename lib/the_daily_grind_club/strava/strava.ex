defmodule TheDailyGrindClub.Strava do
  alias TheDailyGrindClub.Athletes
  alias TheDailyGrindClub.Athletes.Athlete

  @config Application.get_env(:the_daily_grind_club, TheDailyGrindClub.Athletes)

  def get_all_athletes_with_updated_activities do
    Athletes.list_athletes() |> Enum.map(&get_athlete_with_updated_activities/1)
  end

  def get_athlete_with_updated_activities(%Athlete{} = athlete) do
    athlete = @config[:backend].refresh_access_token(athlete)
    activities = @config[:backend].fetch_athlete_activities(athlete)
    {:ok, athlete} = update_athlete_activities(athlete, activities)
    athlete
  end

  def update_athlete_activities(%Athlete{} = athlete, activities) when is_list(activities) do
    Athletes.update_athlete(athlete, %{
      activities: Poison.encode!(activities),
      last_fetch: NaiveDateTime.utc_now()
    })
  end

  def update_athlete_activities(%Athlete{}, _), do: nil

  def get_login_url do
    @config[:backend].get_oauth_authorization_url()
  end

  def get_strava_id_by_oauth_code(code) do
    @config[:backend].get_strava_id_by_oauth_code(code)
  end
end
