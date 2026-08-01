import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { json, urlencoded } from 'express';
import { SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from 'src/common/interceptor/response.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpExceptionFilter } from 'src/common/filters/new-not-found-exception.filter';
import swaggerConfig from './swagger/swagger.config';

interface Error {
    name: string;
    error: string;
}
type Errors = Error[];

export const bootstrapApp = (app: NestExpressApplication) => {
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
    app.setGlobalPrefix('api/v1', {
        exclude: ['/'],
    });
    app.enableVersioning();
    app.useGlobalPipes(
        new ValidationPipe({
            skipMissingProperties: false,
            whitelist: true,
            transform: true,
            exceptionFactory: (errors: ValidationError[]) => {
                const errMsg: Errors = [];
                errors.forEach((err: any) => {
                    if ('children' in err && err.children.length > 0 && 'children' in err.children[0]) {
                        err.children[0].children.forEach((value) => {
                            errMsg.push({
                                name: value.property,
                                error: Object.values(value.constraints)[0] as string,
                            });
                        });
                    } else {
                        errMsg.push({
                            name: err.property,
                            error: Object.values(err.constraints)[0] as string,
                        });
                    }
                });
                return new UnprocessableEntityException({
                    errors: errMsg,
                    // message: 'Unprocessable Content',
                    // statusCode: 422,
                });
            },
        }),
    );

    // if (process.env.APP_ENV !== 'production') {
        const document = SwaggerModule.createDocument(app, swaggerConfig);
        SwaggerModule.setup('api-documentation', app, document, {
            swaggerOptions: { defaultModelsExpandDepth: -1 },
            customSiteTitle: 'Moments By QR API Documentation',
            customfavIcon: 'assets/favicon.ico',
        });
    // }

    app.useGlobalFilters(new HttpExceptionFilter());
    // note: deprecated old filter
    // app.useGlobalFilters(new NotFoundExceptionFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());

    // app.enableCors({
    //     origin: [process.env.ADMIN_BASE_PATH, process.env.APP_URL], // Allow specific domains
    //     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Allowed HTTP methods
    //     credentials: true, // Include cookies if using session-based auth
    // });
};
