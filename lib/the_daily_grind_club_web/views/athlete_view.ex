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
    |> Enum.map(
      &%{
        id: &1.id,
        stravaId: &1.strava_id,
        firstName: &1.first_name,
        lastName: &1.last_name,
        lastFetch:
          if(&1.last_fetch, do: NaiveDateTime.to_iso8601(&1.last_fetch) <> "Z", else: nil),
        lastVisit:
          if(&1.last_visit, do: NaiveDateTime.to_iso8601(&1.last_visit) <> "Z", else: nil),
        activeDays: active_days(&1),
        activities: Poison.decode!(&1.activities)
      }
    )
    |> Poison.encode!()
  end

  def active_days(%Athlete{activities: nil}), do: 0

  def active_days(%Athlete{activities: activities}) do
    activities
    |> Poison.decode!()
    |> Stream.map(
      &%{
        &1
        | "start_date_local" =>
            &1["start_date_local"]
            |> DateTime.from_iso8601()
            |> elem(1)
            |> DateTime.to_date()
      }
    )
    |> Enum.group_by(& &1["start_date_local"], & &1["moving_time"])
    |> Map.to_list()
    |> Enum.map(fn {date, durations} ->
      %{"day" => date, "minutes" => durations |> Enum.sum() |> div(60)}
    end)
  end
end
