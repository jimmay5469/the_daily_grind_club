defmodule TheDailyGrindClub.Repo.Migrations.CreateAthletes do
  use Ecto.Migration

  def change do
    create table(:athletes) do
      add :strava_id, :integer
      add :first_name, :string
      add :last_name, :string
      add :activities, :binary
      add :last_fetch, :naive_datetime
      add :access_token, :string
      add :access_token_expiration, :naive_datetime
      add :refresh_token, :string

      timestamps()
    end

  end
end
