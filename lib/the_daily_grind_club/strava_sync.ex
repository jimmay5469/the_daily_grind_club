defmodule TheDailyGrindClub.StravaSync do
  use GenServer

  def start_link([]) do
    GenServer.start_link(__MODULE__, %{})
  end

  def init(state) do
    do_work()
    schedule_work()
    {:ok, state}
  end

  def handle_info(:work, state) do
    do_work()
    schedule_work()
    {:noreply, state}
  end

  defp schedule_work() do
    Process.send_after(self(), :work, 15 * 60 * 1000)
  end

  defp do_work() do
    TheDailyGrindClub.Strava.fetch_all_activities()
  end
end
