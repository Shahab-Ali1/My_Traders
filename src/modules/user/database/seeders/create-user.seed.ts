import { Factory, Seeder } from 'typeorm-seeding';
import { DataSource } from 'typeorm';
import { User } from '../../entity/user.entity';
import { PasswordUtil } from 'src/utility/hashing';
import { Gender, UserRoles } from '../../constants/user-role.enum';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: DataSource): Promise<void> {
    const usersRepository = connection.getRepository(User);

    await usersRepository.save(
      usersRepository.create({
        storeId: null,
        first_name: 'John',
        last_name: 'Doe',
        email: 'admin@admin.com',
        password: await PasswordUtil.hash('@Admin123'),
        gender: Gender.MALE,
        role: UserRoles.ADMIN,
      }),
    );
  }
}
