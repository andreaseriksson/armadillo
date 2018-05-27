defmodule ArmadilloWeb.SessionView do
  use ArmadilloWeb, :view

  def render("session.json", %{jwt: jwt, channel_name: channel_name, channel_name: channel_name, crypto_token: crypto_token}) do
    # TODO: Added channel_name and crypto_token instead of 2FA
    %{success: true, token: jwt, channel_name: channel_name, crypto_token: crypto_token}
  end

  def render("session.json", %{}) do
    %{success: false, pending_approval: true, message: "This device is pending approval"}
  end

  def render("error.json", %{}) do
    %{success: false, message: "Wrong sign in credentials"}
  end

  def render("forbidden.json", %{}) do
    %{success: false, message: "You are not authorized for this request"}
  end
end
