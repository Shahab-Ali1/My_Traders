import { Table, TableColumnOptions } from 'typeorm';
export class BaseMigration {
  primaryId(): any {
    return {
      name: 'id',
      type: 'SERIAL',
      isPrimary: true,
    };
  }

  baseColumns(): any {
    return [
      {
        name: 'created_at',
        type: 'timestamptz',
        default: 'now()',
      },
      {
        name: 'updated_at',
        type: 'timestamptz',
        default: 'now()',
        onUpdate: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'deleted_at',
        type: 'timestamptz',
        isNullable: true,
      },
      {
        name: 'flags',
        type: 'int',
        default: 1,
      },
    ];
  }

//   timestamp(name, defaultValue?) {
//     const column = {
//       name: name,
//       type: 'timestamptz',
//     };

//     if (defaultValue) {
//       column['default'] = 'now()';
//     }

//     return column;
//   }

//   flags() {
//     return {
//       name: 'flags',
//       type: 'int',
//       default: 1,
//     };
//   }

  createTable(queryRunner, name, columns: Array<TableColumnOptions> = [], baseColumns = true) {
    return queryRunner.createTable(
      new Table({
        name: name,
        columns: [this.primaryId(), ...columns, ...(baseColumns ? this.baseColumns() : [])],
      }),
    );
  }
}
