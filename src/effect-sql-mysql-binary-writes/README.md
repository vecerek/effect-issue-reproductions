# Effect SQL (MySQL) binary write issue

## Actual behavior

When attempting to write binary values — constructed using `new Uint8Array` (and similar) — into a table using `unprepared` statements, the operation fails with an error similar to:

```
Error: Column count doesn't match value count at row 1
  <stacktrace truncated> {
code: 'ER_WRONG_VALUE_COUNT_ON_ROW',
errno: 1136,
sqlState: '21S01',
sqlMessage: "Column count doesn't match value count at row 1",
sql: 'INSERT INTO examples (`id`) VALUES (`0` = 0, `1` = 0, `2` = 0, `3` = 0, `4` = 0, `5` = 0, `6` = 0, `7` = 0, `8` = 0, `9` = 0, `10` = 0, `11` = 0, `12` = 0, `13` = 0, `14` = 0, `15` = 0)'
}
```

Writing the same value using a prepared statement works.
Wrapping the same value in `Buffer.from` and then writing it using an `unprepared` statement also works.

## Expected behavior

The operation succeeds regardless what type of **statement** is used, or what type of **binary value** is given.

## Steps to reproduce

```sh
cd src/effect-sql-mysql-binary-writes
node index.ts
```

### Prerequisites

1. `pnpm install`
2. Have `docker` running
