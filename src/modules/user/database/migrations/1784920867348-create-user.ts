import { BaseMigration } from "src/base/database/migrations/base.migration";
import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";
import { Gender, UserRoles } from "../../constants/user-role.enum";

export class CreateUser1784920867348 extends BaseMigration implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // create store table
        await this.createTable(queryRunner, "stores", [
            { name: 'name', type: 'varchar', length: '255', isNullable: false },
            { name: 'address', type: 'text', isNullable: false },
            { name: 'phone', type: 'varchar', length: '100', isNullable: false },
        ]);

        // create user table
        await this.createTable(queryRunner, "users", [
            { name: 'store_id', type: 'int', isNullable: true },
            { name: 'first_name', type: 'varchar', length: '100', isNullable: false },
            { name: 'last_name', type: 'varchar', length: '100', isNullable: false },
            { name: 'profile_image_id', type: 'int', isNullable: true },
            { name: 'email', type: 'varchar', length: '100', isNullable: false },
            { name: 'password', type: 'varchar', length: '100', isNullable: false },
            {
                name: 'gender',
                type: 'enum',
                enum: Object.values(Gender),
                default: `'${Gender.MALE}'`,
                isNullable: false
            },
            {
                name: 'role', type: 'enum', enum: Object.values(UserRoles),
                default: `'${UserRoles.USER}'`, isNullable: false
            },
            { name: 'last_login_at', type: 'timestamptz', isNullable: true },
            { name: 'metadata', type: 'json', isNullable: true }
        ]);

        // create media table
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

        // add relation with store table
        await queryRunner.createForeignKey(
            'users',
            new TableForeignKey({
                name: 'FK_users_store_id',
                columnNames: ['store_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'stores',
                onDelete: 'CASCADE',
            }),
        );
        // add relation with media table
        await queryRunner.createForeignKey(
            'users',
            new TableForeignKey({
                name: 'FK_users_profile_image_id',
                columnNames: ['profile_image_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'media',
                onDelete: 'SET NULL',
            }),
        );

        // create index on media key column
        await queryRunner.query(`
            CREATE INDEX idx_media_key
            ON media(key)
        `);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // drop foreign key relation
        await queryRunner.dropForeignKey('users', 'FK_users_store_id');
        await queryRunner.dropForeignKey('users', 'FK_users_profile_image_id');

        //    drop index on media key column
        await queryRunner.query(`
            DROP INDEX idx_media_key
        `);

        // drop store table
        await queryRunner.dropTable('stores');
        // drop users table
        await queryRunner.dropTable('users');
        // drop media table
        await queryRunner.dropTable('media');
    }

}
