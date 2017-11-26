defmodule Armadillo.Auth.Secret do
  use Ecto.Schema
  import Ecto.Changeset
  alias Armadillo.Auth.Secret


  schema "secrets" do
    field :description, :string
    field :name, :string
    field :url, :string
    field :uuid, :string
    field :password, Armadillo.Auth.EncryptedField
    field :username, Armadillo.Auth.EncryptedField
    belongs_to :user, Armadillo.Auth.User

    timestamps()
  end

  @doc false
  def changeset(%Secret{} = secret, attrs) do
    secret
    |> cast(attrs, [:name, :username, :password, :url, :description, :uuid])
    |> validate_required([:name])
  end
end
