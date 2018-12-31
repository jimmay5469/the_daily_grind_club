defmodule TheDailyGrindClub.Strava.StravaBackend do
  alias TheDailyGrindClub.Athletes.Athlete

  def fetch_athlete_activities(%Athlete{access_token: nil}), do: nil

  def fetch_athlete_activities(%Athlete{access_token: access_token} = athlete, starting_page \\ 1) do
    {:ok, jan_1, _} = DateTime.from_iso8601("#{Date.utc_today().year}-01-01T00:00:00Z")

    {:ok, response} =
      HTTPoison.get(
        "https://www.strava.com/api/v3/athlete/activities?per_page=200&after=#{
          DateTime.to_unix(jan_1)
        }&page=#{starting_page}",
        [Authorization: "Bearer #{access_token}"],
        timeout: 50_000,
        recv_timeout: 50_000
      )

    activities = Poison.decode!(response.body)

    if Enum.count(activities) == 200 do
      activities ++ fetch_athlete_activities(athlete, starting_page + 1)
    else
      activities
    end
  end

  def fetch_athlete(%Athlete{access_token: nil}), do: nil

  def fetch_athlete(%Athlete{access_token: access_token}) do
    {:ok, response} =
      HTTPoison.get(
        "https://www.strava.com/api/v3/athlete",
        [Authorization: "Bearer #{access_token}"],
        timeout: 50_000,
        recv_timeout: 50_000
      )

    Poison.decode!(response.body)
  end
end
