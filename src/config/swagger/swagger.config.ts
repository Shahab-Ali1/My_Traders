import { DocumentBuilder } from "@nestjs/swagger";

const config = new DocumentBuilder()
    .setTitle(process.env.APP_NAME as string)
    .setDescription(`${process.env.APP_NAME as string} API documentation`)
    .setVersion('1.0')
    .addBearerAuth(
        {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
        },
        'token',
    )
    .build();

export default config;