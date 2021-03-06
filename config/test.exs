use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :armadillo, ArmadilloWeb.Endpoint,
  http: [port: 4001],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :armadillo, Armadillo.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "armadillo_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox

config :cipher,
  keyphrase: System.get_env("CIPHER_KEYPHRASE"),
  ivphrase: System.get_env("CIPHER_IVPHRASE"),
  magic_token: "magictoken"
