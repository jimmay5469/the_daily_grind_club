defmodule TheDailyGrindClubWeb.UserSocket do
  use Phoenix.Socket

  channel("athletes:*", TheDailyGrindClubWeb.AthleteChannel)

  def connect(%{"token" => token}, socket, _connect_info) do
    case Phoenix.Token.verify(socket, "user socket", token, max_age: 60 * 60 * 24 * 7) do
      {:ok, strava_id} ->
        {:ok, assign(socket, :strava_id, strava_id)}

      {:error, reason} ->
        :error
    end
  end

  def id(_socket), do: nil
end
