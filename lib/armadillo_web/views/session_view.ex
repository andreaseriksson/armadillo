defmodule ArmadilloWeb.SessionView do
  use ArmadilloWeb, :view

  def render("session.json", %{jwt: jwt}) do
    %{success: true, token: jwt}
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
