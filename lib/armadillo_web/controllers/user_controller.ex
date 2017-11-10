defmodule ArmadilloWeb.UserController do
  use ArmadilloWeb, :controller

  alias Armadillo.Auth
  alias Armadillo.Auth.User

  import Armadillo.Auth.Session

  plug Guardian.Plug.EnsureAuthenticated, [handler: ArmadilloWeb.SessionController] when not action in [:create]

  action_fallback ArmadilloWeb.FallbackController

  def create(conn, %{"user" => user_params}) do
    with {:ok, %User{} = user} <- Auth.create_user(user_params) do
      conn
      |> put_status(:created)
      |> render("show.json", user: user)
    end
  end

	def show(conn, _) do
		user = current_user(conn)
		render(conn, "show.json", user: user)
	end

  def update(conn, %{"user" => user_params}) do
    user = current_user(conn)

    with {:ok, %User{} = user} <- Auth.update_user(user, user_params) do
      render(conn, "show.json", user: user)
    end
  end

  def delete(conn, _) do
    user = current_user(conn)
    with {:ok, %User{}} <- Auth.delete_user(user) do
      send_resp(conn, :no_content, "")
    end
  end
end
