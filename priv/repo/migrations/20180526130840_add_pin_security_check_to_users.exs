defmodule Armadillo.Repo.Migrations.AddPinSecurityCheckToUsers do
  use Ecto.Migration

  def change do
    alter table("users") do
      add :pin_security_check, :string
    end
  end
end
