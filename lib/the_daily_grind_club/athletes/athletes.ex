defmodule TheDailyGrindClub.Athletes do
  @moduledoc """
  The Athletes context.
  """

  import Ecto.Query, warn: false
  alias TheDailyGrindClub.Repo

  alias TheDailyGrindClub.Athletes.Athlete

  @config Application.get_env(:the_daily_grind_club, __MODULE__)

  def strava_login_url do
    @config[:backend].authorization_url()
  end

  @doc """
  Returns the list of athletes.

  ## Examples

      iex> list_athletes()
      [%Athlete{}, ...]

  """
  def list_athletes do
    Repo.all(Athlete)
  end

  def list_athletes(sync_activities: true) do
    list_athletes() |> Enum.map(&get_athlete_with_updated_activities/1)
  end

  @doc """
  Gets a single athlete.

  Raises `Ecto.NoResultsError` if the Athlete does not exist.

  ## Examples

      iex> get_athlete!(123)
      %Athlete{}

      iex> get_athlete!(456)
      ** (Ecto.NoResultsError)

  """
  def get_athlete!(id), do: Repo.get!(Athlete, id)

  @doc """
  Gets a single athlete.

  Raises `Ecto.NoResultsError` if the Athlete does not exist.

  ## Examples

      iex> get_athlete_by_strava_id!(123)
      %Athlete{}

      iex> get_athlete_by_strava_id!(456)
      ** (Ecto.NoResultsError)

  """
  def get_athlete_by_strava_id!(strava_id), do: Repo.get_by!(Athlete, strava_id: strava_id)

  @doc """
  Gets a single athlete.

  ## Examples

      iex> get_athlete_by_strava_code(123)
      {:ok, %Athlete{}}

      iex> get_athlete_by_strava_code(456)
      {:error, %{strava_id: "789"}}

  """
  def get_athlete_by_strava_code(strava_code) do
    access_token = @config[:backend].generate_access_token(strava_code)

    try do
      get_athlete_by_strava_id!(access_token.strava_id)
      |> update_access_token(access_token)
      |> get_athlete_with_updated_activities()
    rescue
      Ecto.NoResultsError ->
        strava_athlete = @config[:backend].fetch_athlete(access_token)

        if(Enum.member?(strava_athlete.clubs, 493_369)) do
          {:ok, athlete} = access_token |> Map.merge(strava_athlete) |> Athletes.create_athlete()

          athlete
        else
          {:error, %{strava_id: strava_athlete.strava_id}}
        end
    end
  end

  @doc """
  Creates a athlete.

  ## Examples

      iex> create_athlete(%{field: value})
      {:ok, %Athlete{}}

      iex> create_athlete(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_athlete(attrs \\ %{}) do
    %Athlete{}
    |> Athlete.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a athlete.

  ## Examples

      iex> update_athlete(athlete, %{field: new_value})
      {:ok, %Athlete{}}

      iex> update_athlete(athlete, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_athlete(%Athlete{} = athlete, attrs) do
    {:ok, athlete} =
      athlete
      |> Athlete.changeset(attrs)
      |> Repo.update()

    TheDailyGrindClubWeb.Endpoint.broadcast(
      "athletes:update_athlete",
      "update_athlete",
      TheDailyGrindClubWeb.AthleteView.athlete_map(athlete)
    )

    {:ok, athlete}
  end

  defp update_access_token(%Athlete{} = athlete, access_token) do
    if(access_token.access_token != athlete.access_token) do
      {:ok, athlete} = Athletes.update_athlete(athlete, access_token)
    end

    athlete
  end

  defp get_athlete_with_updated_activities(%Athlete{} = athlete) do
    access_token = @config[:backend].refresh_access_token(athlete)
    athlete = update_access_token(athlete, access_token)
    activities = @config[:backend].fetch_athlete_activities(athlete)

    {:ok, athlete} =
      Athletes.update_athlete(athlete, %{
        activities: Poison.encode!(activities),
        last_fetch: NaiveDateTime.utc_now()
      })

    athlete
  end
end
