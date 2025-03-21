import { SqlClient } from "@effect/sql"
import { Effect } from "effect"

export default Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient

  yield* Effect.log("Performing migration")

  yield* sql`CREATE TABLE IF NOT EXISTS examples (
    id binary(16) PRIMARY KEY
  )`
})
