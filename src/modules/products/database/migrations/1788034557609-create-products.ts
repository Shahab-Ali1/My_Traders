import { BaseMigration } from "src/base/database/migrations/base.migration";
import { MigrationInterface, QueryRunner, TableForeignKey, TableIndex } from "typeorm";

export class CreateProducts1788034557609 extends BaseMigration implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await this.createTable(queryRunner, 'products', [
            { name: 'category_id', type: 'int', isNullable: false },
            { name: 'store_id', type: 'int', isNullable: false },
            { name: "name", type: "varchar", length: "100", isNullable: false },
            { name: "description", type: "text", isNullable: true },
            { name: "purchase_price", type: "decimal", isNullable: false },
            { name: "sale_price", type: "decimal", isNullable: false },
            { name: "stock", type: "varchar", isNullable: false },
            { name: 'image_id', type: 'bigint', isNullable: true },
            { name: 'metadata', type: 'json', isNullable: true }
        ]);
        // add foreign key for category_id
        await queryRunner.createForeignKey(
            'products',
            new TableForeignKey({
                name: 'FK_products_category_id',
                columnNames: ['category_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'categories',
                onDelete: 'cascade',
            }),
        );
        // add foreign key for store_id
        await queryRunner.createForeignKey(
            'products',
            new TableForeignKey({
                name: 'FK_products_store_id',
                columnNames: ['store_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'stores',
                onDelete: 'SET NULL',
            }),
        );
        // add foreign key for image_id
        await queryRunner.createForeignKey(
            'products',
            new TableForeignKey({
                name: 'FK_products_image_id',
                columnNames: ['image_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'media',
                onDelete: 'SET NULL',
            }),
        );
        // add index for name
        await queryRunner.createIndex(
            'products',
            new TableIndex({
                name: 'IDX_PRODUCTS_NAME',
                columnNames: ['name'],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('products', 'FK_products_category_id');
        await queryRunner.dropForeignKey('products', 'FK_products_store_id');
        await queryRunner.dropForeignKey('products', 'FK_products_image_id');
        await queryRunner.dropIndex('products', 'IDX_PRODUCTS_NAME');
        await queryRunner.dropTable('products');
    }

}
