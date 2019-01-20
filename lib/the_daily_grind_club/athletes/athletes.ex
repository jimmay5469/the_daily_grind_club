defmodule TheDailyGrindClub.Athletes do
  @moduledoc """
  The Athletes context.
  """

  import Ecto.Query, warn: false
  alias TheDailyGrindClub.Repo

  alias TheDailyGrindClub.Athletes.Athlete

  @doc """
  Returns the list of athletes.

  ## Examples

      iex> list_athletes()
      [%Athlete{}, ...]

  """
  def list_athletes do
    Repo.all(Athlete)
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

  def get_athlete_by_strava_id(strava_id), do: Repo.get_by!(Athlete, strava_id: strava_id)

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

  @doc """
  Deletes a Athlete.

  ## Examples

      iex> delete_athlete(athlete)
      {:ok, %Athlete{}}

      iex> delete_athlete(athlete)
      {:error, %Ecto.Changeset{}}

  """
  def delete_athlete(%Athlete{} = athlete) do
    Repo.delete(athlete)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking athlete changes.

  ## Examples

      iex> change_athlete(athlete)
      %Ecto.Changeset{source: %Athlete{}}

  """
  def change_athlete(%Athlete{} = athlete) do
    Athlete.changeset(athlete, %{})
  end
end
