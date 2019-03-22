defmodule TheDailyGrindClub.AthletesTest do
  use TheDailyGrindClub.DataCase

  alias TheDailyGrindClub.Athletes

  describe "athletes" do
    alias TheDailyGrindClub.Athletes.Athlete

    @valid_attrs %{
      access_token: "some access_token",
      access_token_expiration: ~N[2010-04-17 14:00:00],
      activities: "some activities",
      first_name: "some first_name",
      last_fetch: ~N[2010-04-17 14:00:00],
      last_name: "some last_name",
      refresh_token: "some refresh_token",
      strava_id: 42
    }
    @update_attrs %{
      access_token: "some updated access_token",
      access_token_expiration: ~N[2011-05-18 15:01:01],
      activities: "some updated activities",
      first_name: "some updated first_name",
      last_fetch: ~N[2011-05-18 15:01:01],
      last_name: "some updated last_name",
      refresh_token: "some updated refresh_token",
      strava_id: 43
    }
    @invalid_attrs %{
      access_token: nil,
      access_token_expiration: nil,
      activities: nil,
      first_name: nil,
      last_fetch: nil,
      last_name: nil,
      refresh_token: nil,
      strava_id: nil
    }

    def athlete_fixture(attrs \\ %{}) do
      {:ok, athlete} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Athletes.create_athlete()

      athlete
    end

    test "list_athletes/0 returns all athletes" do
      athlete = athlete_fixture()
      assert Athletes.list_athletes() == [athlete]
    end

    test "get_athlete!/1 returns the athlete with given id" do
      athlete = athlete_fixture()
      assert Athletes.get_athlete!(athlete.id) == athlete
    end

    test "create_athlete/1 with valid data creates a athlete" do
      assert {:ok, %Athlete{} = athlete} = Athletes.create_athlete(@valid_attrs)
      assert athlete.access_token == "some access_token"
      assert athlete.access_token_expiration == ~N[2010-04-17 14:00:00]
      assert athlete.activities == "some activities"
      assert athlete.first_name == "some first_name"
      assert athlete.last_fetch == ~N[2010-04-17 14:00:00]
      assert athlete.last_name == "some last_name"
      assert athlete.refresh_token == "some refresh_token"
      assert athlete.strava_id == 42
    end

    test "create_athlete/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Athletes.create_athlete(@invalid_attrs)
    end

    test "update_athlete/2 with valid data updates the athlete" do
      athlete = athlete_fixture()
      assert {:ok, %Athlete{} = athlete} = Athletes.update_athlete(athlete, @update_attrs)
      assert athlete.access_token == "some updated access_token"
      assert athlete.access_token_expiration == ~N[2011-05-18 15:01:01]
      assert athlete.activities == "some updated activities"
      assert athlete.first_name == "some updated first_name"
      assert athlete.last_fetch == ~N[2011-05-18 15:01:01]
      assert athlete.last_name == "some updated last_name"
      assert athlete.refresh_token == "some updated refresh_token"
      assert athlete.strava_id == 43
    end

    test "update_athlete/2 with invalid data returns error changeset" do
      athlete = athlete_fixture()
      assert {:error, %Ecto.Changeset{}} = Athletes.update_athlete(athlete, @invalid_attrs)
      assert athlete == Athletes.get_athlete!(athlete.id)
    end
  end
end
