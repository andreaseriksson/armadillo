defmodule Armadillo.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :email, :string
      add :password_hash, :string
      add :crypto_token, :string
      add :reset_password_sent_at, :naive_datetime
      add :reset_password_token, :string

      timestamps()
    end

    create index(:users, :email, unique: true)
    create index(:users, :crypto_token, unique: true)
    create index(:users, :reset_password_token, unique: true)
  end
end
