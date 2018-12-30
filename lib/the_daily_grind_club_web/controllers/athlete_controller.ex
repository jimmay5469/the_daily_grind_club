defmodule TheDailyGrindClubWeb.AthleteController do
  use TheDailyGrindClubWeb, :controller

  alias TheDailyGrindClub.Athletes

  def index(conn, _params) do
    render(conn, "index.html", athletes: Athletes.list_athletes())
  end
end
