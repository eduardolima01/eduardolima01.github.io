import initSqlJs, { type Database, type SqlJsStatic } from 'sql.js'
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url'

let SQL: SqlJsStatic | null = null
let dbInstance: Database | null = null

async function getSqlJs(): Promise<SqlJsStatic> {
  if (!SQL) {
    SQL = await initSqlJs({ locateFile: () => sqlWasmUrl })
  }
  return SQL
}

export async function loadFromUrl(url: string): Promise<Database> {
  const sql = await getSqlJs()
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Não foi possível carregar o banco em ${url} (${res.status})`)
  }
  const buffer = await res.arrayBuffer()
  dbInstance = new sql.Database(new Uint8Array(buffer))
  return dbInstance
}

export async function createEmpty(schema: string): Promise<Database> {
  const sql = await getSqlJs()
  dbInstance = new sql.Database()
  dbInstance.run(schema)
  return dbInstance
}

function ensureDb(): Database {
  if (!dbInstance) {
    throw new Error(
      'Banco não carregado. Chame loadFromUrl(), loadFromFile() ou createEmpty() primeiro.'
    )
  }
  return dbInstance
}

export type SqlParam = string | number | null | Uint8Array

export function run(sql: string, params: SqlParam[] = []): void {
  ensureDb().run(sql, params as never)
}

export function query<T = Record<string, unknown>>(
  sql: string,
  params: SqlParam[] = []
): T[] {
  const stmt = ensureDb().prepare(sql)
  if (params.length) stmt.bind(params as never)

  const rows: T[] = []
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as T)
  }
  stmt.free()
  return rows
}

export function exportBytes(): Uint8Array {
  return ensureDb().export()
}
