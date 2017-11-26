defmodule ArmadilloWeb.UserView do
  use ArmadilloWeb, :view
  alias ArmadilloWeb.UserView

  def render("show.json", %{user: user}) do
    %{data: render_one(user, UserView, "user.json")}
  end

  def render("user.json", %{user: user}) do
    %{
      email: user.email,
      crypto_token: user.crypto_token
    }
    end

  def render("create.json", %{user: user, jwt: jwt}) do
    %{
      data: %{
        email: user.email,
        crypto_token: user.crypto_token,
        json_web_token: jwt
      }
    }
  end
end
