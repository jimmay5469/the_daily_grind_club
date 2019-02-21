defmodule TheDailyGrindClub.Strava.Backends do
  alias TheDailyGrindClub.Athletes.Athlete

  @callback fetch_athlete_activities(Athlete.t()) :: []
  @callback fetch_athlete(String.t()) :: %{}
  @callback get_oauth_authorization_url() :: String.t()
  @callback get_strava_id_by_oauth_code(String.t()) :: String.t()
  @callback refresh_access_token(Athlete.t()) :: Athlete.t()
end
