defmodule Mix.Tasks.StravaImport do
  defmodule Activities do
    use Mix.Task

    def run(_args) do
      Mix.Task.run("app.start")

      TheDailyGrindClub.Athletes.list_athletes(sync_activities: true)
    end
  end
end
