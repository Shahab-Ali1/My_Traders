import { DocumentBuilder } from "@nestjs/swagger";

const config = new DocumentBuilder()
    .setTitle(process.env.APP_NAME as string)
    .setDescription(process.env.APP_DESCRIPTION as string)
    .setVersion('1.0')
    // .addTag('cats')
    .build();

export default config;