defmodule ArmadilloWeb.SessionController do
  use ArmadilloWeb, :controller

  def create(conn, %{"email" => email, "password" => password}) do
    case Armadillo.Auth.Session.authenticate(email, password) do
      {:ok, user} ->
        {:ok, jwt, _full_claims} = user |> Guardian.encode_and_sign(:token)
        conn
          |> put_status(:created)
          |> render("session.json", jwt: jwt)
      :error ->
        conn
        |> put_status(:unprocessable_entity)
        |> render("error.json")
    end
  end

  def create(conn, _) do
    conn
    |> put_status(:unprocessable_entity)
    |> render("error.json")
  end

  def unauthenticated(conn, _params) do
    conn
    |> put_status(:forbidden)
    |> render(ArmadilloWeb.SessionView, "forbidden.json")
  end
end
