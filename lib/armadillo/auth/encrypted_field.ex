defmodule Armadillo.Auth.EncryptedField do
  # Assert that this module behaves like an Ecto.Type so that the compiler can
  # warn us if we forget to implement the 4 callback functions below.
  @behaviour Ecto.Type

  def type, do: :string

  # This is called on a value in queries if it is not a string.
  def cast(value) do
    {:ok, to_string(value)}
  end

  # This is called when the field value is about to be written to the database
  def dump(value) do
    ciphertext = value
                 |> to_string
                 |> Cipher.encrypt

    {:ok, ciphertext}
  end

  # This is called when the field is loaded from the database
  def load(value) do
    {:ok, Cipher.decrypt(value)}
  end
end
