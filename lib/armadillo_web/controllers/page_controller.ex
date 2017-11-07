defmodule ArmadilloWeb.PageController do
  use ArmadilloWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
