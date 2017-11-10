defmodule Armadillo.Auth.Session do
  alias Armadillo.Repo
  alias Armadillo.Auth.User

  def authenticate(email, password) do
    case Repo.get_by(User, email: email) do
      nil ->
        :error
      user ->
        case verify_password(password, user.password_hash) do
          true ->
            {:ok, user}
          _ ->
            :error
        end
    end
  end

  defp verify_password(password, password_hash) do
    Comeonin.Bcrypt.checkpw(password, password_hash)
  end

  def current_user(conn) do
    Guardian.Plug.current_resource(conn)
  end
end
