defmodule Armadillo.Repo.Migrations.CreateDevices do
  use Ecto.Migration

  def change do
    create table(:devices) do
      add :uuid, :string
      add :approved, :boolean, default: false, null: false
      add :user_id, references(:users, on_delete: :delete_all)

      timestamps()
    end

    create index(:devices, [:user_id])
    create index(:devices, [:uuid], unique: true)
  end
end
