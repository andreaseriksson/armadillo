defmodule ArmadilloWeb.SessionController do
  use ArmadilloWeb, :controller

  def create(conn, %{"email" => email, "password" => password, "device_uuid" => device_uuid}) do
    user_agent = get_req_header(conn, "user-agent") |> List.first()
    remote_ip = to_string(:inet_parse.ntoa(conn.remote_ip))

    case Armadillo.Auth.Session.authenticate(email, password) do
      {:ok, user} ->
        response =
          case Armadillo.Auth.attempt_sign_in(user, device_uuid, user_agent, remote_ip) do
            # TODO: Added channel_name and crypto_token instead of 2FA
            {:ok, jwt} ->
              %{
                jwt: jwt,
                channel_name: user.channel_name,
                crypto_token: user.crypto_token,
                pin_security_check: user.pin_security_check
              }

            :pending ->
              %{}
          end

        conn
        |> put_status(:created)
        |> render("session.json", response)

      :error ->
        conn
        |> put_status(:unprocessable_entity)
        |> render("error.json")
    end
  end

  def create(conn, _) do
    conn
    |> put_status(:unprocessable_entity)
    |> render("error.json")
  end

  def unauthenticated(conn, _params) do
    conn
    |> put_status(:forbidden)
    |> render(ArmadilloWeb.SessionView, "forbidden.json")
  end
end
