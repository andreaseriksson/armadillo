defmodule Armadillo.Auth.Device do
  use Ecto.Schema
  import Ecto.Changeset
  alias Armadillo.Auth.Device


  schema "devices" do
    field :approved, :boolean, default: false
    field :uuid, :string
    belongs_to :user, Armadillo.Auth.User

    timestamps()
  end

  @doc false
  def changeset(%Device{} = device, attrs) do
    device
    |> cast(attrs, [:uuid, :approved])
    |> validate_required([:uuid])
  end
end
