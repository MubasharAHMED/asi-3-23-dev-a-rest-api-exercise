import { resolve } from "node:path"

const config = {
  port: 3001,
  db: {
    client: "pg",
    connection: {
      user: "mubashar",
      database: "rest_api",
      password: "password",
    },
    migrations: {
      directory: resolve("./src/db/migrations"),
      stub: resolve("./src/db/migration.stub"),
    },
  },
}

export default config
