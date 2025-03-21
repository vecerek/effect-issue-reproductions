import { MysqlClient } from "@effect/sql-mysql2"
import { Effect, Layer, Redacted } from "effect"
import { MysqlContainer } from "./mysql-container.ts"

export const DBClientLayer = Effect.gen(function* () {
  const container = yield* MysqlContainer

  return MysqlClient.layer({
    database: container.getDatabase(),
    host: container.getHost(),
    password: Redacted.make(container.getUserPassword()),
    port: container.getPort(),
    username: container.getUsername(),
  })
}).pipe(Layer.unwrapEffect, Layer.provide(MysqlContainer.Layer))
