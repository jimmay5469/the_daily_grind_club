defmodule TheDailyGrindClubWeb.AthleteController do
  use TheDailyGrindClubWeb, :controller

  alias TheDailyGrindClub.Athletes
  alias TheDailyGrindClub.Strava

  def index(conn, _params) do
    case get_session(conn, :strava_id) do
      nil ->
        render(conn, "index.html", athletes: [])

      strava_id ->
        try do
          athlete =
            strava_id
            |> Athletes.get_athlete_by_strava_id()
            |> Athletes.update_athlete(%{last_visit: NaiveDateTime.utc_now()})
            |> elem(1)

          render(conn, "index.html", athletes: Athletes.list_athletes())
        rescue
          Ecto.NoResultsError -> render(conn, "index.html", athletes: [])
        end
    end
  end

  def token_exchange(conn, %{"code" => code}) do
    {:ok, response} =
      HTTPoison.post(
        "https://www.strava.com/oauth/token",
        {:form,
         [
           client_id: Application.get_env(:the_daily_grind_club, Strava)[:strava_client_id],
           client_secret:
             Application.get_env(:the_daily_grind_club, Strava)[:strava_client_secret],
           grant_type: "authorization_code",
           code: code
         ]}
      )

    response_body = Poison.decode!(response.body)

    athlete =
      try do
        {:ok, athlete} =
          response_body["athlete"]["id"]
          |> Athletes.get_athlete_by_strava_id()
          |> Athletes.update_athlete(%{
            first_name: response_body["athlete"]["firstname"],
            last_name: response_body["athlete"]["lastname"],
            access_token: response_body["access_token"],
            access_token_expiration: response_body["expires_at"],
            refresh_token: response_body["refresh_token"]
          })

        Strava.fetch_athlete_activities(athlete)
        athlete
      rescue
        Ecto.NoResultsError ->
          case Strava.is_authorized(response_body["access_token"]) do
            false ->
              %{strava_id: response_body["athlete"]["id"]}

            true ->
              {:ok, athlete} =
                Athletes.create_athlete(%{
                  strava_id: response_body["athlete"]["id"],
                  first_name: response_body["athlete"]["firstname"],
                  last_name: response_body["athlete"]["lastname"],
                  access_token: response_body["access_token"],
                  access_token_expiration: response_body["expires_at"],
                  refresh_token: response_body["refresh_token"]
                })

              Strava.fetch_athlete_activities(athlete)
              athlete
          end
      end

    conn
    |> put_session(:strava_id, athlete.strava_id)
    |> redirect(to: "/")
  end

  def logout(conn, _params) do
    conn
    |> configure_session(drop: true)
    |> redirect(to: "/")
  end
end
