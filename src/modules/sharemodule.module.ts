import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { CategoriesModule } from './categories/categories.module';
import { StoreModule } from "./store/store.module";

@Module({
    imports: [
        AuthModule,
        StoreModule,
        UserModule,
        CategoriesModule
    ],
})
export class shareModule { }