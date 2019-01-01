defmodule TheDailyGrindClubWeb.LayoutView do
  use TheDailyGrindClubWeb, :view

  def strava_login_url do
    "https://www.strava.com/oauth/authorize?client_id=#{
      Application.get_env(:the_daily_grind_club, TheDailyGrindClub.Strava)[:strava_client_id]
    }&response_type=code&redirect_uri=#{
      Application.get_env(:the_daily_grind_club, TheDailyGrindClub.Strava)[:strava_redirect_url]
    }&scope=read_all,profile:read_all,activity:read_all&approval_prompt=force"
  end
end
