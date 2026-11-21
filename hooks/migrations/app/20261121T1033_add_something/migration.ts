#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/81806048054eaa4c10de525b0f0c1b2c79304ed6f820eeea0f935ed6b7ac42de/contract';
import startContract from '../../snapshots/81806048054eaa4c10de525b0f0c1b2c79304ed6f820eeea0f935ed6b7ac42de/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/b265cf50fe218b97735c59423ec191a389c22592b320f6e22e030bf14a018fb2/contract';
import endContract from '../../snapshots/b265cf50fe218b97735c59423ec191a389c22592b320f6e22e030bf14a018fb2/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

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
      this.dropConstraint({ schema: 'public', table: 'Zap', constraint: 'Zap_triggerId_key' }),
      this.createIndex({
        schema: 'public',
        table: 'Zap',
        index: 'Zap_triggerId_key',
        columns: ['triggerId'],
        extras: { unique: true },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Zap',
        foreignKey: {
          name: 'Zap_triggerId_fkey',
          columns: ['triggerId'],
          references: { schema: 'public', table: 'Trigger', columns: ['id'] },
          onDelete: 'restrict',
          onUpdate: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
