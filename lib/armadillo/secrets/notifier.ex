defmodule Armadillo.Secrets.Notifier do
  alias ArmadilloWeb.Endpoint
  alias ArmadilloWeb.SecretView

  def send(:created, user, secret) do
    Endpoint.broadcast! channel_name(user), "secret:created", SecretView.render("show.json", %{secret: secret})
  end

  def send(:updated, user, secret) do
    Endpoint.broadcast! channel_name(user), "secret:updated", SecretView.render("show.json", %{secret: secret})
  end

  def send(:deleted, user, secret) do
    Endpoint.broadcast! channel_name(user), "secret:deleted", %{uuid: secret.uuid}
  end

  defp channel_name(user), do: "secret:#{user.channel_name}"
  defp render(secret), do: SecretView.render("show.json", %{secret: secret})
end
