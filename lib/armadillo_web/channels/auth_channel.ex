defmodule ArmadilloWeb.AuthChannel do
  use ArmadilloWeb, :channel

  def join("auth:refresh", payload, socket) do
    if authorized?(payload) do
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

  # Add authorization logic here as required
  # check if token exist and verify it
  # https://hexdocs.pm/guardian/Guardian.html#peek_claims/1
  defp authorized?(_payload) do
    true
  end
end
