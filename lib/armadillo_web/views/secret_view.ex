defmodule ArmadilloWeb.SecretView do
  use ArmadilloWeb, :view
  alias ArmadilloWeb.SecretView

  def render("index.json", %{secrets: secrets}) do
    %{data: render_many(secrets, SecretView, "secret.json")}
  end

  def render("show.json", %{secret: secret}) do
    %{data: render_one(secret, SecretView, "secret.json")}
  end

  def render("secret.json", %{secret: secret}) do
    %{
      id: secret.id,
      name: secret.name,
      username: secret.username,
      password: secret.password,
      url: secret.url,
      description: secret.description,
      uuid: secret.uuid
    }
  end
end
