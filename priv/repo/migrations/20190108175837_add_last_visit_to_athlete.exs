defmodule TheDailyGrindClub.Repo.Migrations.AddLastVisitToAthlete do
  use Ecto.Migration

  def change do
    alter table(:athletes) do
      add(:last_visit, :naive_datetime)
    end
  end
end
