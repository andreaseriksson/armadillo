defmodule ArmadilloWeb.SessionControllerTest do
  use ArmadilloWeb.ConnCase

  alias Armadillo.Auth

  @create_user_attrs %{email: "some@email.com", password: "supersecret", password_confirmation: "supersecret"}
  @valid_credentials %{email: "some@email.com", password: "supersecret"}
  @invalid_credentials %{email: "wrong@email", password: ""}

  def fixture(:user) do
    {:ok, user} = Auth.create_user(@create_user_attrs)
    user
  end

  setup %{conn: conn} do
    create_user(conn)
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "create session" do
    test 'authenticates the user and return the jason web token', %{conn: conn} do
      conn = post conn, session_path(conn, :create), @valid_credentials
      assert %{"success" => true, "token" => _} = json_response(conn, 201)
    end

    test "returns an error message if credentials are wrong", %{conn: conn} do
      conn = post conn, session_path(conn, :create), @invalid_credentials
      assert %{"success" => false, "message" => _} = json_response(conn, 422)
    end

    test "returns an error message if credentials are missing", %{conn: conn} do
      conn = post conn, session_path(conn, :create), %{}
      assert %{"success" => false, "message" => _} = json_response(conn, 422)
    end
  end

  defp create_user(_) do
    user = fixture(:user)
    {:ok, user: user}
  end
end
