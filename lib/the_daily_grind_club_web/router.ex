defmodule TheDailyGrindClubWeb.Router do
  use TheDailyGrindClubWeb, :router
  alias Plug.Conn

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug :put_user_token
    plug :allow_iframe
  end

  defp put_user_token(conn, _) do
    if strava_id = get_session(conn, :strava_id) do
      token = Phoenix.Token.sign(conn, "user socket", strava_id)
      assign(conn, :user_token, token)
    else
      conn
    end
  end

  defp allow_iframe(conn, _) do
    Conn.delete_resp_header(conn, "x-frame-options")
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", TheDailyGrindClubWeb do
    pipe_through :browser

    get "/authenticate_strava_athlete", AthleteController, :authenticate_strava_athlete
    get "/logout", AthleteController, :logout
    get "/*react_route", AthleteController, :index
  end

  # Other scopes may use custom stacks.
  # scope "/api", TheDailyGrindClubWeb do
  #   pipe_through :api
  # end
end
