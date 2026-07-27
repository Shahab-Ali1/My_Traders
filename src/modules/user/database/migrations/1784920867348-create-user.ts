import { BaseMigration } from "src/base/database/migrations/base.migration";
import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";
import { Gender, UserRoles } from "../../constants/user-role.enum";

export class CreateUser1784920867348 extends BaseMigration implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await this.createTable(queryRunner, "users", [
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

        await queryRunner.createForeignKey(
            'users',
            new TableForeignKey({
                columnNames: ['profile_image_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'media',
                onDelete: 'SET NULL',
            }),
        );

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users');
    }

}
