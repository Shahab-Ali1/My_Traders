import { BaseEntity } from "src/base/entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Gender, UserRoles } from "../constants/user-role.enum";
import { Exclude } from "class-transformer";
import { Media } from "./media.entity";

@Entity("users")
export class User extends BaseEntity {
    @Column({ type: 'varchar', length: 100, nullable: false })
    first_name: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    last_name: string;

    @ManyToOne(() => Media, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({
        name: 'profile_image_id',
    })
    profileImage: Media;

    @Column({ type: 'varchar', length: 100, nullable: false })
    email: string;

    @Exclude()
    @Column({ type: 'varchar', length: 100, nullable: false })
    password: string;

    @Column({
        type: 'enum',
        enum: Gender,
        nullable: true
    })
    gender: Gender;

    @Column({
        type: 'enum',
        enum: UserRoles,
        default: UserRoles.USER,
        nullable: false
    })
    role: string;

    @Column({ type: 'timestamptz', nullable: true })
    last_login_at: string;

    @Column({ type: 'json', nullable: true })
    metadata: any;
}