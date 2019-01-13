defmodule TheDailyGrindClub.Strava.StravaBackend do
  alias TheDailyGrindClub.Athletes
  alias TheDailyGrindClub.Athletes.Athlete

  def fetch_athlete_activities(%Athlete{access_token: nil}), do: nil

  def fetch_athlete_activities(%Athlete{access_token: access_token} = athlete, starting_page \\ 1) do
    {:ok, jan_1, _} = DateTime.from_iso8601("#{Date.utc_today().year - 1}-12-23T00:00:00Z")

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

  def fetch_athlete(access_token) do
    {:ok, response} =
      HTTPoison.get(
        "https://www.strava.com/api/v3/athlete",
        [Authorization: "Bearer #{access_token}"],
        timeout: 50_000,
        recv_timeout: 50_000
      )

    Poison.decode!(response.body)
  end

  def refresh_access_token(
        %Athlete{access_token_expiration: access_token_expiration, refresh_token: refresh_token} =
          athlete
      ) do
    unix_now = DateTime.utc_now() |> DateTime.to_unix()

    if access_token_expiration > unix_now do
      athlete
    else
      {:ok, response} =
        HTTPoison.post(
          "https://www.strava.com/oauth/token",
          {:form,
           [
             client_id:
               Application.get_env(:the_daily_grind_club, TheDailyGrindClub.Strava)[
                 :strava_client_id
               ],
             client_secret:
               Application.get_env(:the_daily_grind_club, TheDailyGrindClub.Strava)[
                 :strava_client_secret
               ],
             grant_type: "refresh_token",
             refresh_token: refresh_token
           ]}
        )

      response_body = Poison.decode!(response.body)

      {:ok, athlete} =
        Athletes.update_athlete(athlete, %{
          access_token: response_body["access_token"],
          access_token_expiration: response_body["expires_at"],
          refresh_token: response_body["refresh_token"]
        })

      athlete
    end
  end
end
