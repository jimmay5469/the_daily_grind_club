defmodule TheDailyGrindClubWeb.AthleteController do
  use TheDailyGrindClubWeb, :controller

  alias TheDailyGrindClub.Athletes

  def index(conn, _params) do
    case get_session(conn, :athlete_id) do
      nil -> render(conn, "index.html", athletes: [])
      _athlete_id -> render(conn, "index.html", athletes: Athletes.list_athletes())
    end
  end

  def token_exchange(conn, %{"code" => code}) do
    {:ok, response} =
      HTTPoison.post(
        "https://www.strava.com/oauth/token",
        {:form,
         [
           client_id:
             Application.get_env(:the_daily_grind_club, TheDailyGrindClub.Strava)[
               :strava_client_id
             ],
           client_secret:
             Application.get_env(:the_daily_grind_club, TheDailyGrindClub.Strava)[
               :strava_client_secret
             ],
           code: code
         ]}
      )

    response_body = Poison.decode!(response.body)

    case Athletes.get_athlete_by_strava_id(response_body["athlete"]["id"]) do
      nil ->
        redirect(conn, to: "/")

      athlete ->
        Athletes.update_athlete(athlete, %{
          access_token: response_body["access_token"]
        })

        conn
        |> put_session(:athlete_id, athlete.id)
        |> redirect(to: "/")
    end
  end

  def logout(conn, _params) do
    conn
    |> configure_session(drop: true)
    |> redirect(to: "/")
  end
end
