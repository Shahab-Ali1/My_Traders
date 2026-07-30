import { BaseEntity } from "src/base/entity/base.entity";
import { Media } from "src/modules/user/entity/media.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

@Entity('categories')
export class Category extends BaseEntity {
    @Column({ type: 'varchar', length: 100, nullable: false })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    description: string;

    @Column({ type: 'json', nullable: true })
    metadata: any;

    @OneToOne(() => Media, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({
        name: 'image_id',
    })
    image_id: Media;

}
