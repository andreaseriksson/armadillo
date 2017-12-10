defmodule Armadillo.Auth.TwoFactorAuthentication do
  use GenServer

  alias ArmadilloWeb.Endpoint

  def start_link do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  def ask_for_approval(user, device_uuid, user_agent, remote_ip) do
    GenServer.cast(__MODULE__, {:request, user, device_uuid, user_agent, remote_ip})
  end

  def approve(user, device_uuid) do
    GenServer.cast(__MODULE__, {:approve, user, device_uuid})
  end

  def deny(user, device_uuid) do
    GenServer.cast(__MODULE__, {:deny, user, device_uuid})
  end

  def pending_approval do
    GenServer.call(__MODULE__, :pending)
  end

  ### INTERNAL API ###

  def handle_cast({:request, user, device_uuid, user_agent, remote_ip}, state) do
    data = %{
      device_uuid: device_uuid,
      geocode_data: geocode(remote_ip),
      browser: browser(user_agent)
    }

    Endpoint.broadcast! "auth:#{user.channel_name}", "device:request", data

    state = case Enum.member?(state, device_uuid) do
      true ->
        state
      false ->
        Process.send_after(self(), :timeout, 60 * 1000 * 10) # In 10 minutes
        [device_uuid|state]
    end
    {:noreply, state}
  end

  def handle_cast({:approve, user, device_uuid}, state) do
    state = case Enum.member?(state, device_uuid) do
      true ->
        Enum.filter(state, fn(uuid) -> uuid != device_uuid end)
      false ->
        state
    end
    {:noreply, state}
  end

  def handle_cast({:deny, user, device_uuid}, state) do
    state = case Enum.member?(state, device_uuid) do
      true ->
        Enum.filter(state, fn(uuid) -> uuid != device_uuid end)
      false ->
        state
    end
    {:noreply, state}
  end

  def handle_cast({:timeout, user, device_uuid}, state) do
    state = case Enum.member?(state, device_uuid) do
      true ->
        Enum.filter(state, fn(uuid) -> uuid != device_uuid end)
      false ->
        state
    end
    {:noreply, state}
  end

  def handle_call(:pending, _from, state) do
    {:reply, state, state}
  end

  defp geocode(_remote_ip) do
    try do
      case HTTPoison.get "https://freegeoip.net/json/155.4.235.182" do
        {:ok, %HTTPoison.Response{status_code: 200, body: body}} -> Poison.decode! body
        _ -> %{}
      end
    rescue
      _ -> %{}
    end
  end

  defp browser(ua) do
    try do
      %{
        full_platform_name: Browser.full_platform_name(ua),
        full_browser_name: Browser.full_browser_name(ua),
        device_type: Browser.device_type(ua)
      }
    rescue
      _ -> %{}
    end
  end
end
