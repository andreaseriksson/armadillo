defmodule ArmadilloWeb.SecretsChannel do
  use ArmadilloWeb, :channel
  use Guardian.Channel
  alias Armadillo.Secrets.Syncer

  def join("secrets:" <> channel_name, %{claims: _claim, resource: _user}, socket) do
    if channel_name == current_user(socket).channel_name do
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("sync:start", payload, socket) do
    secrets = socket
              |> current_user
              |> Syncer.sync(payload)

    broadcast! socket, "sync:end", %{secrets: secrets}
    {:noreply, socket}
  end

  defp current_user(socket) do
    Guardian.Phoenix.Socket.current_resource(socket)
    |> Armadillo.Repo.preload(:secrets)
  end
end
