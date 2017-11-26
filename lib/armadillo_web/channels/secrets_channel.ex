defmodule ArmadilloWeb.SecretsChannel do
  use ArmadilloWeb, :channel
  use Guardian.Channel
  alias Armadillo.Secrets.Syncer

  def join("secrets", %{claims: _claim, resource: _user}, socket) do
    # TODO: Make sure there is a single channel per user
    {:ok, socket}
  end

  def join("secrets", _, _socket) do
    {:error, %{reason: "unauthorized"}}
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
