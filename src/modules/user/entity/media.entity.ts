import { Expose } from "class-transformer";
import { BaseEntity } from "src/base/entity/base.entity";
import { Column, Entity } from "typeorm";

@Entity("media")
export class Media extends BaseEntity {
    @Column({ nullable: false })
    module: string;

    @Column({ nullable: false })
    key: number;

    @Column({ nullable: true })
    ref_type?: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    original_name: string;

    @Column({ nullable: false })
    mime_type: string;

    @Column({ nullable: false })
    size: number;

    @Column({ nullable: false })
    extension: string;

    // Add metadata column
    @Column({ type: 'jsonb', nullable: true })
    metadata?: Record<string, any>;

    @Expose()
    get url() {
        return `${process.env.APP_URL}/${this.key}/${this.name}`;
    }

}