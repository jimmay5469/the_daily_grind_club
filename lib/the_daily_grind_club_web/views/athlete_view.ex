defmodule TheDailyGrindClubWeb.AthleteView do
  use TheDailyGrindClubWeb, :view

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
