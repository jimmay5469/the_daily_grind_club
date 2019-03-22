defmodule TheDailyGrindClub.Athletes.Backends do
  @type url :: String.t()
  @type access_code :: String.t()
  @type access_token :: %{
          strava_id: String.t(),
          first_name: String.t(),
          last_name: String.t(),
          access_token: String.t(),
          access_token_expiration: integer,
          refresh_token: String.t()
        }
  @type strava_athlete :: %{
          strava_id: String.t(),
          first_name: String.t(),
          last_name: String.t(),
          activities: [strava_activity],
          clubs: [integer]
        }
  @type strava_activity :: map

  @callback authorization_url() :: url
  @callback generate_access_token(access_code) :: access_token
  @callback refresh_access_token(access_token) :: access_token
  @callback fetch_athlete(access_token) :: strava_athlete
  @callback fetch_athlete_activities(access_token) :: [strava_activity]
end
