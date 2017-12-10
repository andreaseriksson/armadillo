defmodule ArmadilloWeb.AuthChannel do
  use ArmadilloWeb, :channel
  use Guardian.Channel

  alias Armadillo.Auth.TwoFactorAuthentication

  def join("auth:" <> channel_name, %{claims: _claim, resource: _user}, socket) do
    if channel_name == current_user(socket).channel_name do
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("token:refresh", payload, socket) do
    token = payload["token"]

    case Guardian.refresh!(token) do
      {:ok, new_token, _claims} ->
        push socket, "token:new", %{token: new_token}
      _ ->
        push socket, "token:unauthorized", %{}
    end

    {:noreply, socket}
  end

  def handle_in("device:approve", %{"device_uuid" => device_uuid}, socket) do
    current_user(socket)
    |> TwoFactorAuthentication.approve(device_uuid)

    {:noreply, socket}
  end

  def handle_in("device:deny", %{"device_uuid" => device_uuid}, socket) do
    current_user(socket)
    |> TwoFactorAuthentication.deny(device_uuid)

    {:noreply, socket}
  end

  defp current_user(socket), do: Guardian.Phoenix.Socket.current_resource(socket)
end
