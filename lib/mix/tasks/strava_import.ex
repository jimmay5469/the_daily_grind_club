defmodule Mix.Tasks.StravaImport do
  defmodule Activities do
    use Mix.Task

    def run(_args) do
      Mix.Task.run("app.start")

      TheDailyGrindClub.Strava.fetch_all_activities()
    end
  end
end
