import { Exclude, Expose } from "class-transformer";
import { BaseEntity } from "src/base/entity/base.entity";
import { FlagsEnum } from "src/common/constants/flags.enum";
import { Category } from "src/modules/categories/entity/category.entity";
import { Store } from "src/modules/store/entity/store.entity";
import { Media } from "src/modules/user/entity/media.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

@Entity('products')
export class Product extends BaseEntity {

    @Column({
        name: 'category_id',
        type: 'integer',
        nullable: false,
    })
    categoryId: number;

    @ManyToOne(() => Category, (category) => category.products, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Exclude()
    @Column({
        name: 'store_id',
        type: 'integer',
        nullable: false,
    })
    storeId: number;

    @ManyToOne(() => Store, (store) => store.products, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'store_id' })
    store: Store;

    @OneToOne(() => Media, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({
        name: 'image_id',
    })
    media: Media;

    @Column({ type: 'varchar', length: 100, nullable: false })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    description: string | null;

    @Column({ name: "purchase_price", type: 'numeric', nullable: false })
    purchasePrice: number;

    @Column({ name: "sale_price", type: 'numeric', nullable: false })
    salePrice: number;

    @Column({ type: 'varchar', nullable: false })
    stock: string;

    @Column({ type: 'json', nullable: true })
    metadata: any;

    @Expose()
    get status(): string {
        return this.flags === FlagsEnum.ACTIVE ? 'active' : 'inactive';
    }
}
