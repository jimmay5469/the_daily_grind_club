defmodule TheDailyGrindClubWeb.AthleteView do
  use TheDailyGrindClubWeb, :view

  alias TheDailyGrindClub.Athletes.Athlete

  def strava_login_url do
    "https://www.strava.com/oauth/authorize?client_id=#{
      Application.get_env(:the_daily_grind_club, TheDailyGrindClub.Strava)[:strava_client_id]
    }&response_type=code&redirect_uri=#{
      Application.get_env(:the_daily_grind_club, TheDailyGrindClub.Strava)[:strava_redirect_url]
    }&scope=read,profile:read_all,activity:read"
  end

  def athletes_json(athletes) do
    athletes
    |> athletes_map()
    |> Poison.encode!()
  end

  def athletes_map(athletes) do
    Enum.map(athletes, &athlete_map/1)
  end

  def athlete_map(athlete) do
    %{
      id: athlete.id,
      stravaId: athlete.strava_id,
      firstName: athlete.first_name,
      lastName: athlete.last_name,
      lastFetch:
        if(athlete.last_fetch, do: NaiveDateTime.to_iso8601(athlete.last_fetch) <> "Z", else: nil),
      lastVisit:
        if(athlete.last_visit, do: NaiveDateTime.to_iso8601(athlete.last_visit) <> "Z", else: nil),
      activities: Poison.decode!(athlete.activities)
    }
  end
end
