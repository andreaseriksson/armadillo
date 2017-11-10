defmodule ArmadilloWeb.SecretController do
  use ArmadilloWeb, :controller

  alias Armadillo.Auth
  alias Armadillo.Auth.Secret

  import Armadillo.Auth.Session

  plug Guardian.Plug.EnsureAuthenticated, handler: ArmadilloWeb.SessionController

  action_fallback ArmadilloWeb.FallbackController

  def index(conn, _params) do
    secrets = Auth.list_secrets(current_user(conn))
    render(conn, "index.json", secrets: secrets)
  end

  def create(conn, %{"secret" => secret_params}) do
    with {:ok, %Secret{} = secret} <- Auth.create_secret(current_user(conn), secret_params) do
      conn
      |> put_status(:created)
      |> render("show.json", secret: secret)
    end
  end

  def show(conn, %{"id" => id}) do
    secret = Auth.get_secret!(current_user(conn), id)
    render(conn, "show.json", secret: secret)
  end

  def update(conn, %{"id" => id, "secret" => secret_params}) do
    secret = Auth.get_secret!(current_user(conn), id)

    with {:ok, %Secret{} = secret} <- Auth.update_secret(secret, secret_params) do
      render(conn, "show.json", secret: secret)
    end
  end

  def delete(conn, %{"id" => id}) do
    secret = Auth.get_secret!(current_user(conn), id)
    with {:ok, %Secret{}} <- Auth.delete_secret(secret) do
      send_resp(conn, :no_content, "")
    end
  end
end
