defmodule TheDailyGrindClubWeb.AthleteView do
  use TheDailyGrindClubWeb, :view

  alias TheDailyGrindClub.Athletes.Athlete

  def active_days(%Athlete{activities: nil}), do: 0

  def active_days(%Athlete{activities: activities}) do
    activities
    |> Poison.decode!()
    |> Stream.map(& &1["start_date_local"])
    |> Stream.map(&NaiveDateTime.from_iso8601!(&1))
    |> Stream.map(&NaiveDateTime.to_date(&1))
    |> Stream.uniq()
    |> Enum.count()
  end

  def activity_count(%Athlete{activities: nil}), do: 0

  def activity_count(%Athlete{activities: activities}) do
    activities
    |> Poison.decode!()
    |> Enum.count()
  end

  def active_time(%Athlete{activities: nil}), do: "0 hours 0 minutes"

  def active_time(%Athlete{activities: activities}) do
    total_minutes =
      activities
      |> Poison.decode!()
      |> Stream.map(& &1["moving_time"])
      |> Enum.sum()
      |> div(60)

    "#{div(total_minutes, 60)} hours #{rem(total_minutes, 60)} minutes"
  end
end
