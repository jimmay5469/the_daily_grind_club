defmodule TheDailyGrindClub.Athletes.Athlete do
  use Ecto.Schema
  import Ecto.Changeset

  schema "athletes" do
    field :strava_id, :integer
    field :first_name, :string
    field :last_name, :string
    field :activities, :binary
    field :last_fetch, :naive_datetime
    field :access_token, :string
    field :access_token_expiration, :integer
    field :refresh_token, :string

    timestamps()
  end

  @doc false
  def changeset(athlete, attrs) do
    athlete
    |> cast(attrs, [
      :strava_id,
      :first_name,
      :last_name,
      :activities,
      :last_fetch,
      :access_token,
      :access_token_expiration,
      :refresh_token
    ])
    |> validate_required([:strava_id, :first_name, :last_name])
  end
end
