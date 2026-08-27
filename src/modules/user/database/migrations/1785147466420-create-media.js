import { BaseMigration } from "src/base/database/migrations/base.migration";
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMedia1785147466420 extends BaseMigration implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await this.createTable(queryRunner, "media", [
            { name: 'module', type: 'varchar', length: '255', isNullable: false },
            { name: 'key', type: 'varchar', length: '255', isNullable: false },
            { name: 'ref_type', type: 'varchar', length: '255', isNullable: true },
            { name: 'name', type: 'varchar', length: '255', isNullable: false },
            { name: 'original_name', type: 'varchar', length: '255', isNullable: false },
            { name: 'mime_type', type: 'varchar', length: '255', isNullable: false },
            { name: 'size', type: 'bigint', isNullable: false },
            { name: 'extension', type: 'varchar', length: '255', isNullable: false },
            { name: 'metadata', type: 'json', isNullable: true },
        ]);

        await queryRunner.query(`
            CREATE INDEX idx_media_key
            ON media(key)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("media")
    }

}
