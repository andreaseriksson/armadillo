defmodule ArmadilloWeb.Router do
  use ArmadilloWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug Guardian.Plug.VerifyHeader
    plug Guardian.Plug.LoadResource
  end

  # Other scopes may use custom stacks.
  scope "/api", ArmadilloWeb do
    pipe_through :api

    post "/signup", UserController, :create
    get "/profile", UserController, :show
    put "/profile", UserController, :update
    delete "/delete_profile", UserController, :delete

    post "/signin", SessionController, :create
    resources "/secrets", SecretController, except: [:new, :edit]
  end

  scope "/", ArmadilloWeb do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
    get "/*path", PageController, :index
  end
end
