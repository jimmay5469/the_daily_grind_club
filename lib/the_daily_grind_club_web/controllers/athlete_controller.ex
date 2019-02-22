defmodule TheDailyGrindClubWeb.AthleteController do
  use TheDailyGrindClubWeb, :controller

  alias TheDailyGrindClub.Athletes
  alias TheDailyGrindClub.Strava

  def index(conn, _params) do
    case get_session(conn, :strava_id) do
      nil ->
        render(conn, "index.html", is_authorized: false)

      strava_id ->
        try do
          strava_id
          |> Athletes.get_athlete_by_strava_id!()
          |> Athletes.update_athlete(%{last_visit: NaiveDateTime.utc_now()})

          render(conn, "index.html", is_authorized: true)
        rescue
          Ecto.NoResultsError -> render(conn, "index.html", is_authorized: false)
        end
    end
  end

  def authenticate_strava_athlete(conn, %{"code" => code}) do
    conn
    |> put_session(:strava_id, Strava.get_strava_id_by_oauth_code(code))
    |> redirect(to: "/")
  end

  def logout(conn, _params) do
    conn
    |> configure_session(drop: true)
    |> redirect(to: "/")
  end
end
