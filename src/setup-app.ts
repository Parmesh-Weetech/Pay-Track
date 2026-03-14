import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { CustomExceptionFilter } from "./app/common/exception/custom-exception.filter";
import { isProd } from "./app/common/helper/env";

export const setupApp = (app: INestApplication) => {
    const configService = app.get(ConfigService);

    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix, { exclude: ['u/:shortUrl'] });

    /* -------------------- GLOBAL SETUP -------------------- */
    app.useGlobalPipes(
        new ValidationPipe({
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );
    app.useGlobalFilters(new CustomExceptionFilter());

    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });

    /* -------------------- SWAGGER SETUP -------------------- */
    if (!isProd()) {
        const swaggerConfigV1 = new DocumentBuilder()
            .setTitle('PayTrack API - V1')
            .setDescription('API documentation')
            .addBearerAuth()
            .setVersion('1.0')
            .build();

        const documentV1 = SwaggerModule.createDocument(app, swaggerConfigV1, {
            deepScanRoutes: true,
        });

        SwaggerModule.setup('api/docs/v1', app, documentV1, {
            swaggerOptions: {
                persistAuthorization: true,
                docExpansion: 'list',
                tagsSorter: 'alpha',
                operationsSorter: 'alpha',
                filter: true,
                displayRequestDuration: true,
            },
            jsonDocumentUrl: 'api/docs/v1-json',
            customSiteTitle: 'PayTrack API - V1',
        });
    }
}