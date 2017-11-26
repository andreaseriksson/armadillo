defmodule Armadillo.Auth.User do
  use Ecto.Schema
  import Ecto.Changeset
  alias Armadillo.Auth.User


  schema "users" do
    field :crypto_token, :string
    field :channel_name, :string
    field :email, :string
    field :password, :string, virtual: true
    field :password_confirmation, :string, virtual: true
    field :password_hash, :string
    field :reset_password_sent_at, :naive_datetime
    field :reset_password_token, :string
    has_many :secrets, Armadillo.Auth.Secret

    timestamps()
  end

  # @doc false
  def changeset(%User{} = user, attrs) do
    user
    |> cast(attrs, [:email])
    |> validate_required([:email])
    |> validate_format(:email, ~r/@/)
    |> unique_constraint(:email)
  end

  @doc false
  def registration_changeset(%User{} = user, attrs) do
    user
    |> cast(attrs, [:email, :password])
    |> validate_required([:email, :password])
    |> validate_format(:email, ~r/@/)
    |> unique_constraint(:email)
    |> validate_length(:password, min: 6, max: 100)
    |> validate_confirmation(:password)
    |> put_pass_hash()
    |> set_token()
    |> set_channel_name()
  end

  @doc false
  defp put_pass_hash(changeset) do
    case changeset do
      %Ecto.Changeset{valid?: true, changes: %{password: pass}} ->
        put_change(changeset, :password_hash, Comeonin.Bcrypt.hashpwsalt(pass))
      _ ->
        changeset
    end
  end

  defp set_token(changeset) do
    token = create_token(50)
    if Armadillo.Repo.get_by(User, %{crypto_token: token}) do
      set_token(changeset)
    else
      put_change(changeset, :crypto_token, token)
    end
  end

  defp set_channel_name(changeset) do
    name = "channel-#{create_token(10)}"
    if Armadillo.Repo.get_by(User, %{channel_name: name}) do
      set_channel_name(changeset)
    else
      put_change(changeset, :channel_name, name)
    end
  end

  defp create_token(length) do
    :crypto.strong_rand_bytes(length) |> Base.url_encode64 |> binary_part(0, length)
  end
end
