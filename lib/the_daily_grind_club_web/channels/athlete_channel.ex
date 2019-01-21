defmodule TheDailyGrindClubWeb.AthleteChannel do
  use TheDailyGrindClubWeb, :channel

  alias TheDailyGrindClub.Athletes

  intercept(["update_athlete"])

  def join("athletes:update_athlete", _params, %{assigns: %{strava_id: strava_id}} = socket) do
    try do
      strava_id
      |> Athletes.get_athlete_by_strava_id()
      |> Athletes.update_athlete(%{last_visit: NaiveDateTime.utc_now()})

      {:ok,
       Athletes.list_athletes()
       |> TheDailyGrindClubWeb.AthleteView.athletes_map(), socket}
    rescue
      Ecto.NoResultsError ->
        {:ok,
         []
         |> TheDailyGrindClubWeb.AthleteView.athletes_map(), socket}
    end
  end

  def handle_out("update_athlete", athlete, socket) do
    push(socket, "update_athlete", athlete)

    {:noreply, socket}
  end
end
