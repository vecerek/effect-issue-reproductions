import { SqlClient } from "@effect/sql"
import { DBClientLayer } from "./db-client.ts"
import { Array, Effect, Logger } from "effect"
import { MigratorLayer } from "./migrator.ts"

const badId = new Uint8Array(Array.replicate(0x0, 16))
const anotherBadId = new Uint8Array(Array.replicate(0x1, 16))
const goodId = Buffer.from(new Uint8Array(Array.replicate(0x2, 16)))

const program = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient

  yield* sql`TRUNCATE TABLE examples`

  // works
  yield* sql`INSERT INTO examples ${sql.insert({ id: goodId })}`.unprepared

  // works
  yield* sql`INSERT INTO examples ${sql.insert({ id: anotherBadId })}`

  // fails with:
  // [cause]: Error: Column count doesn't match value count at row 1
  //   code: 'ER_WRONG_VALUE_COUNT_ON_ROW',
  //   errno: 1136,
  //   sqlState: '21S01',
  //   sqlMessage: "Column count doesn't match value count at row 1",
  //   sql: 'INSERT INTO examples (`id`) VALUES (`0` = 0, `1` = 0, `2` = 0, `3` = 0, `4` = 0, `5` = 0, `6` = 0, `7` = 0, `8` = 0, `9` = 0, `10` = 0, `11` = 0, `12` = 0, `13` = 0, `14` = 0, `15` = 0)'
  yield* sql`INSERT INTO examples ${sql.insert({ id: badId })}`.unprepared
})

program.pipe(
  Effect.provide(MigratorLayer),
  Effect.provide(DBClientLayer),
  Effect.provide(Logger.json),
  Effect.runPromise
)
