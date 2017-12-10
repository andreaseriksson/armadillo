defmodule Armadillo.Auth do
  @moduledoc """
  The Auth context.
  """

  import Ecto.Query, warn: false
  alias Armadillo.Repo

  alias Armadillo.Auth.User
  alias Armadillo.Auth.Device

  # @doc """
  # Gets a single user.
  # """
  def get_user!(id), do: Repo.get!(User, id)

  @doc """
  Creates a user.
  """
  def create_user(attrs \\ %{}) do
    %User{}
    |> User.registration_changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a user.
  """
  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a User.
  """
  def delete_user(%User{} = user) do
    Repo.delete(user)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking user changes.
  """
  def change_user(%User{} = user) do
    User.changeset(user, %{})
  end

  alias Armadillo.Auth.Secret

  @doc """
  Returns the list of secrets.

  ## Examples

      iex> list_secrets()
      [%Secret{}, ...]

  """
  def list_secrets(user) do
    Repo.all(from s in Secret, where: s.user_id == ^user.id)
  end

  @doc """
  Gets a single secret.

  Raises `Ecto.NoResultsError` if the Secret does not exist.

  ## Examples

      iex> get_secret!(123)
      %Secret{}

      iex> get_secret!(456)
      ** (Ecto.NoResultsError)

  """
  def get_secret!(user, uuid), do: Repo.get_by!(Secret, uuid: uuid, user_id: user.id)

  @doc """
  Creates a secret.

  ## Examples

      iex> create_secret(%{field: value})
      {:ok, %Secret{}}

      iex> create_secret(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_secret(user, attrs \\ %{}) do
    %Secret{}
    |> Secret.changeset(attrs)
    |> Ecto.Changeset.put_assoc(:user, user)
    |> Repo.insert()
  end

  @doc """
  Updates a secret.

  ## Examples

      iex> update_secret(secret, %{field: new_value})
      {:ok, %Secret{}}

      iex> update_secret(secret, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_secret(%Secret{} = secret, attrs) do
    secret
    |> Secret.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Secret.

  ## Examples

      iex> delete_secret(secret)
      {:ok, %Secret{}}

      iex> delete_secret(secret)
      {:error, %Ecto.Changeset{}}

  """
  def delete_secret(%Secret{} = secret) do
    Repo.delete(secret)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking secret changes.

  ## Examples

      iex> change_secret(secret)
      %Ecto.Changeset{source: %Secret{}}

  """
  def change_secret(%Secret{} = secret) do
    Secret.changeset(secret, %{})
  end

  @doc """
  Register a device.
  """
  def register_device(user, attrs \\ %{}) do
    %Device{}
    |> Device.changeset(attrs)
    |> Ecto.Changeset.put_assoc(:user, user)
    |> Repo.insert()
  end

  def device_approved(user, uuid) do
    case Repo.get_by(Device, uuid: uuid, user_id: user.id, approved: true) do
      nil ->
        false
      _ ->
        true
    end
  end

  def attempt_sign_in(user, device_uuid, user_agent, remote_ip) do
    if device_approved(user, device_uuid) do
      {:ok, jwt, _full_claims} = Guardian.encode_and_sign(user, :token)
      {:ok, jwt}
    else
      Armadillo.Auth.TwoFactorAuthentication.ask_for_approval(user, device_uuid, user_agent, remote_ip)
      :pending
    end
  end
end
