#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/8e8efe28dcac8528e491cbd3ef328e4385f683d2e2d4c64b05db91bb9b3fc550/contract';
import startContract from '../../snapshots/8e8efe28dcac8528e491cbd3ef328e4385f683d2e2d4c64b05db91bb9b3fc550/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/ed0200984107b80cc47bafd4d82fbc105ce5045dffe26468fc3689fed12ad145/contract';
import endContract from '../../snapshots/ed0200984107b80cc47bafd4d82fbc105ce5045dffe26468fc3689fed12ad145/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'ZapRun',
        columns: [
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('zapId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'ZapRunOutbox',
        columns: [
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('zapRunId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ZapRunOutbox',
        index: 'ZapRunOutbox_zapRunId_key',
        columns: ['zapRunId'],
        extras: { unique: true },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ZapRun',
        foreignKey: {
          name: 'ZapRun_zapId_fkey',
          columns: ['zapId'],
          references: { schema: 'public', table: 'Zap', columns: ['id'] },
          onDelete: 'restrict',
          onUpdate: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ZapRunOutbox',
        foreignKey: {
          name: 'ZapRunOutbox_zapRunId_fkey',
          columns: ['zapRunId'],
          references: { schema: 'public', table: 'ZapRun', columns: ['id'] },
          onDelete: 'restrict',
          onUpdate: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
