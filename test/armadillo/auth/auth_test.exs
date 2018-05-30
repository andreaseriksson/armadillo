defmodule Armadillo.AuthTest do
  use Armadillo.DataCase

  alias Armadillo.Auth

  describe "users" do
    alias Armadillo.Auth.User

    @valid_attrs %{email: "some@email.com", password: "supersecret", password_confirmation: "supersecret"}
    @update_attrs %{email: "some_updated@email.com"}
    @invalid_attrs %{email: nil}

    def user_fixture(attrs \\ %{}) do
      {:ok, user} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Auth.create_user()

      user
    end

    test "get_user!/1 returns the user with given id" do
      user = user_fixture()
      assert Auth.get_user!(user.id).email == user.email
    end

    test "create_user/1 with valid data creates a user" do
      assert {:ok, %User{} = user} = Auth.create_user(@valid_attrs)
      assert user.email == @valid_attrs[:email]
      assert user.crypto_token != nil
    end

    test "create_user/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Auth.create_user(@invalid_attrs)
    end

    test "update_user/2 with valid data updates the user" do
      user = user_fixture()
      assert {:ok, user} = Auth.update_user(user, @update_attrs)
      assert %User{} = user
      assert user.email == @update_attrs[:email]
    end

    test "update_user/2 with invalid data returns error changeset" do
      user = user_fixture()
      assert {:error, %Ecto.Changeset{}} = Auth.update_user(user, @invalid_attrs)
      assert user.email == Auth.get_user!(user.id).email
    end

    test "delete_user/1 deletes the user" do
      user = user_fixture()
      assert {:ok, %User{}} = Auth.delete_user(user)
      assert_raise Ecto.NoResultsError, fn -> Auth.get_user!(user.id) end
    end

    test "change_user/1 returns a user changeset" do
      user = user_fixture()
      assert %Ecto.Changeset{} = Auth.change_user(user)
    end
  end

  describe "secrets" do
    alias Armadillo.Auth.Secret

    @valid_attrs %{description: "some description", name: "some name", password: "some password", url: "some url", username: "some username"}
    @update_attrs %{description: "some updated description", name: "some updated name", password: "some updated password", url: "some updated url", username: "some updated username"}
    @invalid_attrs %{description: nil, name: nil, password: nil, url: nil, username: nil}

    def secret_fixture(attrs \\ %{}) do
      user = user_fixture()
      {:ok, secret} = Auth.create_secret(user, Enum.into(attrs, @valid_attrs))

      secret |> Repo.preload(:user)
    end

    test "list_secrets/0 returns all secrets" do
      secret = secret_fixture()
      user = secret.user
      secrets = Auth.list_secrets(user)
      assert Enum.map(secrets, &(&1.id)) == [secret.id]
    end

    test "get_secret!/1 returns the secret with given id" do
      secret = secret_fixture()
      user = secret.user
      assert Auth.get_secret!(user, secret.id).id == secret.id
    end

    test "create_secret/1 with valid data creates a secret" do 
      user = user_fixture()
      assert {:ok, %Secret{} = secret} = Auth.create_secret(user, @valid_attrs)
      assert secret.description == "some description"
      assert secret.name == "some name"
      assert secret.password == "some password"
      assert secret.url == "some url"
      assert secret.username == "some username"
    end

    test "create_secret/1 with invalid data returns error changeset" do
      user = user_fixture()
      assert {:error, %Ecto.Changeset{}} = Auth.create_secret(user, @invalid_attrs)
    end

    test "update_secret/2 with valid data updates the secret" do
      secret = secret_fixture()
      assert {:ok, secret} = Auth.update_secret(secret, @update_attrs)
      assert %Secret{} = secret
      assert secret.description == "some updated description"
      assert secret.name == "some updated name"
      assert secret.password == "some updated password"
      assert secret.url == "some updated url"
      assert secret.username == "some updated username"
    end

    test "update_secret/2 with invalid data returns error changeset" do
      secret = secret_fixture()
      user = secret.user
      assert {:error, %Ecto.Changeset{}} = Auth.update_secret(secret, @invalid_attrs)
      assert secret.id == Auth.get_secret!(user, secret.id).id
    end

    test "delete_secret/1 deletes the secret" do
      secret = secret_fixture()
      user = secret.user
      assert {:ok, %Secret{}} = Auth.delete_secret(secret)
      assert_raise Ecto.NoResultsError, fn -> Auth.get_secret!(user, secret.id) end
    end

    test "change_secret/1 returns a secret changeset" do
      secret = secret_fixture()
      assert %Ecto.Changeset{} = Auth.change_secret(secret)
    end
  end
end
