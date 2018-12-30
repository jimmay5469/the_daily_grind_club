defmodule TheDailyGrindClub.Athletes.Athlete do
  use Ecto.Schema
  import Ecto.Changeset

  schema "athletes" do
    field :access_token, :string
    field :access_token_expiration, :naive_datetime
    field :activities, :binary
    field :first_name, :string
    field :last_fetch, :naive_datetime
    field :last_name, :string
    field :refresh_token, :string
    field :strava_id, :integer

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
