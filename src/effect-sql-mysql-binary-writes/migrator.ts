import { NodeContext } from "@effect/platform-node"
import { MysqlMigrator } from "@effect/sql-mysql2"
import { Layer } from "effect"
import { fileURLToPath } from "node:url"

export const MigratorLayer = MysqlMigrator.layer({
  loader: MysqlMigrator.fromFileSystem(
    fileURLToPath(new URL("./migrations", import.meta.url))
  ),
  table: "migrations",
}).pipe(Layer.provide(NodeContext.layer))
