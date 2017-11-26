defmodule Armadillo.Repo.Migrations.CreateSecrets do
  use Ecto.Migration

  def change do
    create table(:secrets) do
      add :name, :string
      add :username, :string
      add :password, :string
      add :url, :string
      add :description, :text
      add :uuid, :string
      add :user_id, references(:users, on_delete: :delete_all)

      timestamps()
    end

    create index(:secrets, [:user_id])
    create index(:secrets, [:user_id, :uuid])
  end
end
