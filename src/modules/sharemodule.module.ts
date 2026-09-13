import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { CategoriesModule } from './categories/categories.module';
import { StoreModule } from "./store/store.module";
import { ProductsModule } from './products/products.module';

@Module({
    imports: [
        AuthModule,
        StoreModule,
        UserModule,
        CategoriesModule,
        ProductsModule
    ],
})
export class shareModule { }