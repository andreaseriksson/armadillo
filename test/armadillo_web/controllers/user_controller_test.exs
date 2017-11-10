defmodule ArmadilloWeb.UserControllerTest do
  use ArmadilloWeb.ConnCase

  alias Armadillo.Auth

  @create_attrs %{email: "some@email.com", password: "supersecret", password_confirmation: "supersecret"}
  @update_attrs %{email: "some_updated@email.com"}
  @invalid_attrs %{email: nil}

  def fixture(:user) do
    {:ok, user} = Auth.create_user(@create_attrs)
    user
  end

	setup %{conn: conn} do
		{:ok, conn: put_req_header(conn, "accept", "application/json")}
	end

  describe "create user" do
    test "renders user when data is valid", %{conn: conn} do
      conn = post conn, user_path(conn, :create), user: @create_attrs
      assert %{"email" => email} = json_response(conn, 201)["data"]
      assert email == @create_attrs[:email]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post conn, user_path(conn, :create), user: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update user" do
    setup %{conn: conn} do
      {:ok, user: user} = create_user(conn)
      {:ok, jwt, _full_claims} = Guardian.encode_and_sign(user, :token)
      {:ok, conn: put_req_header(conn, "authorization", jwt)}
    end

    test "renders user when data is valid", %{conn: conn} do
      response = put conn, user_path(conn, :update), user: @update_attrs
      assert %{"email" => email} = json_response(response, 200)["data"]
      assert email == @update_attrs[:email]

      conn = get conn, user_path(conn, :show)
      assert %{"email" => email} = json_response(conn, 200)["data"]
      assert email == @update_attrs[:email]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = put conn, user_path(conn, :update), user: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete user" do
    setup %{conn: conn} do
      {:ok, user: user} = create_user(conn)
      {:ok, jwt, _full_claims} = Guardian.encode_and_sign(user, :token)
      {:ok, conn: put_req_header(conn, "authorization", jwt)}
    end

    test "deletes chosen user", %{conn: conn} do
      response = delete conn, user_path(conn, :delete)
      assert response(response, 204)
    end
  end

  defp create_user(_) do
    user = fixture(:user)
    {:ok, user: user}
  end
end
