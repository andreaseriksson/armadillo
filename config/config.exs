# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :armadillo,
  ecto_repos: [Armadillo.Repo]

# Configures the endpoint
config :armadillo, ArmadilloWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: System.get_env("SECRET_KEY_BASE"),
  render_errors: [view: ArmadilloWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Armadillo.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

config :guardian, Guardian,
  issuer: "Armadillo",
  ttl: { 3, :days },
  verify_issuer: true,
  secret_key: System.get_env("GUARDIAN_SECRET_KEY") || "LMtzATM31U1NB4ML2O2493EyMvjicIjcao0/C5JZgo6fvOGlRsse5HclZn2IYWae",
  serializer: Armadillo.GuardianSerializer

config :cipher,
  keyphrase: System.get_env("CIPHER_KEYPHRASE"),
  ivphrase: System.get_env("CIPHER_IVPHRASE"),
  magic_token: "magictoken"

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
