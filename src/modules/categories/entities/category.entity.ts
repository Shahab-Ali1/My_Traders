import { Exclude, Expose } from "class-transformer";
import { BaseEntity } from "src/base/entity/base.entity";
import { FlagsEnum } from "src/common/constants/flags.enum";
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

    @Exclude()
    @OneToOne(() => Media, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({
        name: 'image_id',
    })
    media: Media;

    @Expose()
    get status(): string {
        return this.flags === FlagsEnum.ACTIVE ? 'active' : 'inactive';
    }

    @Expose()
    get image_url() {
        return this.media ? this.media.url : null;
    }

}
