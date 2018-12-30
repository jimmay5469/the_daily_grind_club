defmodule TheDailyGrindClubWeb.AthleteControllerTest do
  use TheDailyGrindClubWeb.ConnCase

  test "GET /", %{conn: conn} do
    conn = get(conn, "/")
    assert html_response(conn, 200) =~ "Athletes"
  end
end
