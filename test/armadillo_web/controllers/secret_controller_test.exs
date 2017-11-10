defmodule ArmadilloWeb.SecretControllerTest do
  use ArmadilloWeb.ConnCase

  alias Armadillo.Auth
  alias Armadillo.Auth.Secret

  @user_attrs %{email: "some@email.com", password: "supersecret", password_confirmation: "supersecret"}
  @create_attrs %{description: "some description", name: "some name", password: "some password", url: "some url", username: "some username"}
  @update_attrs %{description: "some updated description", name: "some updated name", password: "some updated password", url: "some updated url", username: "some updated username"}
  @invalid_attrs %{description: nil, name: nil, password: nil, url: nil, username: nil}

  def fixture(:secret, user) do
    {:ok, secret} = Auth.create_secret(user, @create_attrs)
    secret
  end

  setup %{conn: conn} do
    {:ok, user: user} = create_user(conn)
    {:ok, jwt, _full_claims} = Guardian.encode_and_sign(user, :token)

    conn = conn
           |> put_req_header("authorization", jwt)
           |> put_req_header("accept", "application/json")

   {:ok, conn: conn, user: user}
  end


  describe "index" do
    test "lists all secrets", %{conn: conn} do
      conn = get conn, secret_path(conn, :index)
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create secret" do
    test "renders secret when data is valid", %{conn: conn} do
      response = post conn, secret_path(conn, :create), secret: @create_attrs
      assert %{"id" => id} = json_response(response, 201)["data"]

      conn = get conn, secret_path(conn, :show, id)
      assert json_response(conn, 200)["data"] == %{
        "id" => id,
        "description" => "some description",
        "name" => "some name",
        "password" => "some password",
        "url" => "some url",
        "username" => "some username"}
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post conn, secret_path(conn, :create), secret: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update secret" do
    setup [:create_secret]

    test "renders secret when data is valid", %{conn: conn, secret: %Secret{id: id} = secret} do
      response = put conn, secret_path(conn, :update, secret), secret: @update_attrs
      assert %{"id" => ^id} = json_response(response, 200)["data"]

      conn = get conn, secret_path(conn, :show, id)
      assert json_response(conn, 200)["data"] == %{
        "id" => id,
        "description" => "some updated description",
        "name" => "some updated name",
        "password" => "some updated password",
        "url" => "some updated url",
        "username" => "some updated username"}
    end

    test "renders errors when data is invalid", %{conn: conn, secret: secret} do
      conn = put conn, secret_path(conn, :update, secret), secret: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete secret" do
    setup [:create_secret]

    test "deletes chosen secret", %{conn: conn, secret: secret} do
      response = delete conn, secret_path(conn, :delete, secret)
      assert response(response, 204)
      assert_error_sent 404, fn ->
        get conn, secret_path(conn, :show, secret)
      end
    end
  end

  defp create_secret(%{conn: _, user: user}) do
    secret = fixture(:secret, user)
    {:ok, secret: secret}
  end

  defp create_user(_) do
    {:ok, user} = Auth.create_user(@user_attrs)
    {:ok, user: user}
  end
end
