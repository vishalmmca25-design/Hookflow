#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/8e8efe28dcac8528e491cbd3ef328e4385f683d2e2d4c64b05db91bb9b3fc550/contract';
import endContract from '../../snapshots/8e8efe28dcac8528e491cbd3ef328e4385f683d2e2d4c64b05db91bb9b3fc550/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/b265cf50fe218b97735c59423ec191a389c22592b320f6e22e030bf14a018fb2/contract';
import startContract from '../../snapshots/b265cf50fe218b97735c59423ec191a389c22592b320f6e22e030bf14a018fb2/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropConstraint({
        schema: 'public',
        table: 'Zap',
        constraint: 'Zap_triggerId_fkey',
        kind: 'foreignKey',
      }),
      this.createTable({
        schema: 'public',
        table: 'Action',
        columns: [
          col('actionId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('zapId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'AvailableAction',
        columns: [
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'AvailableTrigger',
        columns: [
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addRequiredColumnToEmptyTable({
        schema: 'public',
        table: 'Trigger',
        column: 'triggerId',
        type: 'text',
      }),
      this.addRequiredColumnToEmptyTable({
        schema: 'public',
        table: 'Trigger',
        column: 'zapId',
        type: 'text',
      }),
      this.createIndex({
        schema: 'public',
        table: 'Trigger',
        index: 'Trigger_zapId_key',
        columns: ['zapId'],
        extras: { unique: true },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Action',
        foreignKey: {
          name: 'Action_zapId_fkey',
          columns: ['zapId'],
          references: { schema: 'public', table: 'Zap', columns: ['id'] },
          onDelete: 'restrict',
          onUpdate: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Action',
        foreignKey: {
          name: 'Action_actionId_fkey',
          columns: ['actionId'],
          references: { schema: 'public', table: 'AvailableAction', columns: ['id'] },
          onDelete: 'restrict',
          onUpdate: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Trigger',
        foreignKey: {
          name: 'Trigger_triggerId_fkey',
          columns: ['triggerId'],
          references: { schema: 'public', table: 'AvailableTrigger', columns: ['id'] },
          onDelete: 'restrict',
          onUpdate: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Trigger',
        foreignKey: {
          name: 'Trigger_zapId_fkey',
          columns: ['zapId'],
          references: { schema: 'public', table: 'Zap', columns: ['id'] },
          onDelete: 'restrict',
          onUpdate: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
