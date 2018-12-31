defmodule TheDailyGrindClubWeb.Router do
  use TheDailyGrindClubWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", TheDailyGrindClubWeb do
    pipe_through :browser

    get "/", AthleteController, :index
    get "/token_exchange", AthleteController, :token_exchange
    get "/logout", AthleteController, :logout
  end

  # Other scopes may use custom stacks.
  # scope "/api", TheDailyGrindClubWeb do
  #   pipe_through :api
  # end
end
