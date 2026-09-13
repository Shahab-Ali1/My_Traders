import { BaseEntity } from "src/base/entity/base.entity";
import { Product } from "src/modules/products/entity/product.entity";
import { User } from "src/modules/user/entity/user.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity('stores')
export class Store extends BaseEntity {
    @Column({ type: 'varchar', length: 100, nullable: false })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    address: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    phone: string;

    @OneToMany(() => User, (user) => user.store)
    users: User[];

    @OneToMany(() => Product, (product) => product.store)
    products: Product[];
}
