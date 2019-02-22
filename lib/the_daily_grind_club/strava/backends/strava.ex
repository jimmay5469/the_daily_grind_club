defmodule TheDailyGrindClub.Strava.Backends.Strava do
  @behaviour TheDailyGrindClub.Strava.Backends

  alias TheDailyGrindClub.Athletes
  alias TheDailyGrindClub.Athletes.Athlete

  @config Application.get_env(:the_daily_grind_club, TheDailyGrindClub.Athletes)

  @impl true
  def fetch_athlete_activities(%Athlete{access_token: nil}), do: nil

  @impl true
  def fetch_athlete_activities(%Athlete{access_token: access_token} = athlete, starting_page \\ 1) do
    {:ok, jan_1, _} = DateTime.from_iso8601("#{Date.utc_today().year - 1}-12-23T00:00:00Z")

    {:ok, response} =
      HTTPoison.get(
        "https://www.strava.com/api/v3/athlete/activities?per_page=200&after=#{
          DateTime.to_unix(jan_1)
        }&page=#{starting_page}",
        [Authorization: "Bearer #{access_token}"],
        timeout: 50_000,
        recv_timeout: 50_000
      )

    activities = Poison.decode!(response.body)

    if Enum.count(activities) == 200 do
      activities ++ fetch_athlete_activities(athlete, starting_page + 1)
    else
      activities
    end
  end

  @impl true
  def fetch_athlete(access_token) do
    {:ok, response} =
      HTTPoison.get(
        "https://www.strava.com/api/v3/athlete",
        [Authorization: "Bearer #{access_token}"],
        timeout: 50_000,
        recv_timeout: 50_000
      )

    Poison.decode!(response.body)
  end

  @impl true
  def get_oauth_authorization_url() do
    "https://www.strava.com/oauth/authorize?client_id=#{@config[:strava_client_id]}&response_type=code&redirect_uri=#{
      @config[:strava_redirect_url]
    }&scope=read,profile:read_all,activity:read"
  end

  @impl true
  def get_strava_id_by_oauth_code(code) do
    {:ok, response} =
      HTTPoison.post(
        "https://www.strava.com/oauth/token",
        {:form,
         [
           client_id: @config[:strava_client_id],
           client_secret: @config[:strava_client_secret],
           grant_type: "authorization_code",
           code: code
         ]}
      )

    response_body = Poison.decode!(response.body)

    athlete =
      try do
        {:ok, athlete} =
          response_body["athlete"]["id"]
          |> Athletes.get_athlete_by_strava_id!()
          |> Athletes.update_athlete(%{
            first_name: response_body["athlete"]["firstname"],
            last_name: response_body["athlete"]["lastname"],
            access_token: response_body["access_token"],
            access_token_expiration: response_body["expires_at"],
            refresh_token: response_body["refresh_token"]
          })

        activities = fetch_athlete_activities(athlete)

        {:ok, athlete} =
          Athletes.update_athlete(athlete, %{
            activities: Poison.encode!(activities),
            last_fetch: NaiveDateTime.utc_now()
          })

        athlete
      rescue
        Ecto.NoResultsError ->
          case is_authorized(response_body["access_token"]) do
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

              activities = fetch_athlete_activities(athlete)

              {:ok, athlete} =
                Athletes.update_athlete(athlete, %{
                  activities: Poison.encode!(activities),
                  last_fetch: NaiveDateTime.utc_now()
                })

              athlete
          end
      end

    athlete.strava_id
  end

  @impl true
  def refresh_access_token(
        %Athlete{access_token_expiration: access_token_expiration, refresh_token: refresh_token} =
          athlete
      ) do
    unix_now = DateTime.utc_now() |> DateTime.to_unix()

    if access_token_expiration > unix_now do
      athlete
    else
      {:ok, response} =
        HTTPoison.post(
          "https://www.strava.com/oauth/token",
          {:form,
           [
             client_id: @config[:strava_client_id],
             client_secret: @config[:strava_client_secret],
             grant_type: "refresh_token",
             refresh_token: refresh_token
           ]}
        )

      response_body = Poison.decode!(response.body)

      {:ok, athlete} =
        Athletes.update_athlete(athlete, %{
          access_token: response_body["access_token"],
          access_token_expiration: response_body["expires_at"],
          refresh_token: response_body["refresh_token"]
        })

      athlete
    end
  end

  defp is_authorized(access_token) do
    if @config[:backend].fetch_athlete(access_token)["clubs"] do
      @config[:backend].fetch_athlete(access_token)["clubs"]
      |> Stream.map(& &1["id"])
      |> Enum.member?(493_369)
    else
      false
    end
  end
end
