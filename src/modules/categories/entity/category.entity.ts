import { Exclude, Expose } from "class-transformer";
import { BaseEntity } from "src/base/entity/base.entity";
import { FlagsEnum } from "src/common/constants/flags.enum";
import { Product } from "src/modules/products/entity/product.entity";
import { Store } from "src/modules/store/entity/store.entity";
import { Media } from "src/modules/user/entity/media.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";

@Entity('categories')
export class Category extends BaseEntity {
    @Column({ type: 'varchar', length: 100, nullable: false })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    description: string;

    @Column({ type: 'json', nullable: true })
    metadata: any;

    @Exclude()
    @OneToOne(() => Media, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({
        name: 'image_id',
    })
    media: Media;

    @Column({
        name: 'store_id',
        type: 'integer',
        nullable: true,
    })
    storeId: number;

    @ManyToOne(() => Store, (store) => store.users, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'store_id' })
    store: Store;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];

    @Expose()
    get status(): boolean {
        // return this.flags === FlagsEnum.ACTIVE ? 'active' : 'inactive';
        return this.flags === FlagsEnum.ACTIVE ? true : false;
    }

    @Expose()
    get image_url() {
        return this.media ? this.media.url : null;
    }

}
