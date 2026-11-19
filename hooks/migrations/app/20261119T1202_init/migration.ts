#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/81806048054eaa4c10de525b0f0c1b2c79304ed6f820eeea0f935ed6b7ac42de/contract';
import endContract from '../../snapshots/81806048054eaa4c10de525b0f0c1b2c79304ed6f820eeea0f935ed6b7ac42de/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'Trigger',
        columns: [col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } })],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Zap',
        columns: [
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('triggerId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Zap',
        constraint: 'Zap_triggerId_key',
        columns: ['triggerId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Zap',
        foreignKey: {
          name: 'Zap_triggerId_fkey',
          columns: ['triggerId'],
          references: { schema: 'public', table: 'Trigger', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
