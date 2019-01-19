defmodule TheDailyGrindClubWeb.AthleteChannel do
  use TheDailyGrindClubWeb, :channel

  intercept(["update_athlete"])

  def join("athletes:update_athlete", _params, socket) do
    {:ok,
     TheDailyGrindClub.Athletes.list_athletes()
     |> TheDailyGrindClubWeb.AthleteView.athletes_map(), socket}
  end

  def handle_out("update_athlete", athlete, socket) do
    push(socket, "update_athlete", athlete)

    {:noreply, socket}
  end
end
