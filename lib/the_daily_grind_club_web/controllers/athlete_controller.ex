defmodule TheDailyGrindClubWeb.AthleteController do
  use TheDailyGrindClubWeb, :controller

  alias TheDailyGrindClub.Athletes
  alias TheDailyGrindClub.Strava

  def index(conn, _params) do
    case get_session(conn, :athlete_id) do
      nil ->
        render(conn, "index.html", athletes: [], is_admin: false)

      athlete_id ->
        athlete = athlete_id |> Athletes.get_athlete!()

        case athlete |> Strava.is_authorized?() do
          false ->
            render(conn, "index.html", athletes: [], is_admin: false)

          true ->
            TheDailyGrindClub.Strava.fetch_athlete_activities(athlete)

            render(conn, "index.html",
              athletes: Athletes.list_athletes(),
              is_admin: athlete.strava_id == 17_683_278
            )
        end
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
           grant_type: "authorization_code",
           code: code
         ]}
      )

    response_body = Poison.decode!(response.body)

    {:ok, athlete} =
      case Athletes.get_athlete_by_strava_id(response_body["athlete"]["id"]) do
        nil ->
          Athletes.create_athlete(%{
            strava_id: response_body["athlete"]["id"],
            first_name: response_body["athlete"]["firstname"],
            last_name: response_body["athlete"]["lastname"],
            access_token: response_body["access_token"],
            access_token_expiration: response_body["expires_at"],
            refresh_token: response_body["refresh_token"]
          })

        athlete ->
          Athletes.update_athlete(athlete, %{
            first_name: response_body["athlete"]["firstname"],
            last_name: response_body["athlete"]["lastname"],
            access_token: response_body["access_token"],
            access_token_expiration: response_body["expires_at"],
            refresh_token: response_body["refresh_token"]
          })
      end

    conn
    |> put_session(:athlete_id, athlete.id)
    |> redirect(to: "/")
  end

  def logout(conn, _params) do
    conn
    |> configure_session(drop: true)
    |> redirect(to: "/")
  end
end
