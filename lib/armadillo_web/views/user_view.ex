defmodule ArmadilloWeb.UserView do
  use ArmadilloWeb, :view
  alias ArmadilloWeb.UserView

  def render("index.json", %{users: users}) do
    %{data: render_many(users, UserView, "user.json")}
  end

  def render("show.json", %{user: user}) do
    %{data: render_one(user, UserView, "user.json")}
  end

  def render("user.json", %{user: user}) do
    %{
      email: user.email,
      crypto_token: user.crypto_token
    }
  end
end
