import {
  MySqlContainer,
  type StartedMySqlContainer,
} from "@testcontainers/mysql"
import { Context, Data, Effect, Layer } from "effect"

export class MysqlContainerStartError extends Data.TaggedError(
  "MysqlContainerStartError"
)<{ cause?: unknown }> {}

const startMysql = Effect.tryPromise({
  try: () => {
    console.log("Starting mysql container")
    return new MySqlContainer().start()
  },
  catch: (cause) => new MysqlContainerStartError({ cause }),
})

const mysqlContainerResource = Effect.acquireRelease(startMysql, (container) =>
  Effect.promise(() => {
    console.log("Stopping mysql container")
    return container.stop()
  })
)

export class MysqlContainer extends Context.Tag("MysqlContainer")<
  MysqlContainer,
  StartedMySqlContainer
>() {
  static readonly Layer = Layer.scoped(this, mysqlContainerResource)
}
