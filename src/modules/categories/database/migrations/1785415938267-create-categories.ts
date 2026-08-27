import { BaseMigration } from "src/base/database/migrations/base.migration";
import { MigrationInterface, QueryRunner, TableForeignKey, TableIndex } from "typeorm";

export class CreateCategories1785415938267 extends BaseMigration implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await this.createTable(queryRunner, 'categories', [
            { name: 'store_id', type: 'int', isNullable: false },
            { name: "name", type: "varchar", length: "100", isNullable: false },
            { name: "description", type: "text", isNullable: true },
            { name: 'image_id', type: 'bigint', isNullable: true },
            { name: 'metadata', type: 'json', isNullable: true }
        ])


        await queryRunner.createForeignKey(
            'categories',
            new TableForeignKey({
                name: 'FK_categories_store_id',
                columnNames: ['store_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'stores',
                onDelete: 'SET NULL',
            }),
        );

        await queryRunner.createForeignKey(
            'categories',
            new TableForeignKey({
                name: 'FK_categories_image_id',
                columnNames: ['image_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'media',
                onDelete: 'SET NULL',
            }),
        );

        await queryRunner.createIndex(
            'categories',
            new TableIndex({
                name: 'IDX_CATEGORIES_NAME',
                columnNames: ['name'],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('categories', 'FK_categories_store_id');
        await queryRunner.dropForeignKey('categories', 'FK_categories_image_id');
        await queryRunner.dropIndex('categories', 'IDX_CATEGORIES_NAME');
        
        await queryRunner.dropTable('categories');
    }

}
