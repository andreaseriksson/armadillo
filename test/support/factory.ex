defmodule Armadillo.Test.Factory do
  use ExMachina.Ecto, repo: Armadillo.Repo

  def secret_factory do
    %Armadillo.Auth.Secret{
      uuid: Ecto.UUID.generate(),
      description: "some description",
      name: "some name",
      password: "some password",
      url: "some url",
      username: "some username"
    }
  end
end
