defmodule TheDailyGrindClubWeb.AthleteView do
  use TheDailyGrindClubWeb, :view

  alias TheDailyGrindClub.Athletes.Athlete

  def utc_day_of_year do
    today = Date.utc_today()
    {:ok, jan_1} = Date.new(today.year, 1, 1)
    Date.diff(today, jan_1) + 1
  end

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
end
