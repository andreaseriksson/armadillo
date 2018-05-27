defmodule Armadillo.Secrets.Syncer do
  alias Armadillo.Auth
  alias Armadillo.Repo

  @doc """
  Entrypoint. Initializes the sync
  """
  def sync(user, %{"secrets" => secrets_from_client, "events" => events}) do
    user.secrets
    |> filter_and_delete(uuids_to_delete(events))
    |> update_from_client(user, uuids_to_update(events), secrets_from_client)
    |> to_attributes()
  end

  defp get_uuids(list) do
    Enum.map(list, fn(item) -> item["uuid"] end)
  end

  defp uuids_to_delete(events) do
    Enum.filter(events, fn(event) -> event["type"] == "DELETE_SECRET" end)
    |> get_uuids()
  end

  defp uuids_to_update(events) do
    Enum.filter(events, fn(event) -> event["type"] == "SAVE_SECRET" end)
    |> get_uuids()
  end

  defp filter_and_delete(secrets, uuids) do
    secrets
    |> Enum.filter(fn(secret) ->
      case Enum.member?(uuids, secret.uuid) do
        true ->
          Auth.delete_secret(secret)
          false
        false ->
          true
      end
    end)
  end

  defp update_from_client(secrets_from_database, user, _changed_uuids, secrets_from_client) do
    uuids_from_database = Enum.map(secrets_from_database, fn(s) -> s.uuid end)
    uuids_from_client = get_uuids(secrets_from_client)
    uuids_to_create_in_database = uuids_from_client -- uuids_from_database
    uuids_to_update_in_database = uuids_from_client -- uuids_to_create_in_database

    new_secrets_in_database =
      (uuids_from_client -- uuids_from_database)
      |> Enum.map(fn(uuid) ->
        secret_attrs = Enum.find(secrets_from_client, fn(s) -> s["uuid"] == uuid end)
        {:ok, secret} = Auth.create_secret(user, secret_attrs)
        secret
      end)

    exsisting_and_updated_secrets =
      secrets_from_database
      |> Enum.map(fn(secret) ->
        if Enum.member?(uuids_to_update_in_database, secret.uuid) do
          attrs = Enum.find(secrets_from_client, fn(s) -> s["uuid"] == secret.uuid end)
          {:ok, secret} = Auth.update_secret(secret, attrs)
          secret
        else
          # Return unupdated secret
          secret
        end
      end)

    exsisting_and_updated_secrets ++ new_secrets_in_database

    #########
    # uuids_from_database = Enum.map(secrets_from_database, fn(s) -> s.uuid end)
    # uuids_from_client = get_uuids(secrets_from_client)
    #
    # # common_uuids
    #
    # # Create the missing secrets in the database
    # uuids_to_create_in_database = uuids_from_client -- uuids_from_database
    #
    # created_secrets =
    #   Enum.map(secrets_from_client, fn(secret) ->
    #     if Enum.member?(uuids_to_create_in_database, secret["uuid"]) do
    #       {:ok, secret} = Auth.create_secret(user, secret)
    #       secret
    #     end
    #   end)
    #
    # # Update the db with the changed secrets
    # uuids_to_update_in_database = uuids_from_client -- uuids_to_create_in_database
    #
    # updated_secrets =
    #   Enum.map(secrets_from_database, fn(secret) ->
    #     if Enum.member?(uuids_to_update_in_database, secret.uuid) do
    #       attrs = Enum.find(secrets_from_client, fn(s) -> s["uuid"] == secret.uuid end)
    #       {:ok, secret} = Auth.update_secret(secret, attrs)
    #       secret
    #     # else
    #     #   # Return unupdated secret
    #     #   secret
    #     end
    #   end)
    #
    # (updated_secrets ++ created_secrets)
    # |> Enum.filter(fn(s) -> s != nil end)
  end

  defp to_attributes(secrets) do
    Enum.map(secrets, fn(secret) ->
      %{
        "name" => secret.name,
        "username" => secret.username,
        "password" => secret.password,
        "url" => secret.url,
        "description" => secret.description,
        "uuid" => secret.uuid
      }
    end)
  end
end
