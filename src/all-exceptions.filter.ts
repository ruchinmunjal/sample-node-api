import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { CustomLoggerService } from './custom-logger/custom-logger.service';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';

type CustomResponseObj = {
  statusCode: number;
  timestamp: string;
  path: string;
  response: string | object;
};
@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new CustomLoggerService(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const customResponse: CustomResponseObj = {
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: request.url,
      response: '',
    };
    if (exception instanceof HttpException) {
      customResponse.statusCode = exception.getStatus();
      customResponse.response = exception.getResponse();
    } else if (exception instanceof PrismaClientValidationError) {
      customResponse.statusCode = 422;
      customResponse.response = exception.message.replaceAll(/\n/g, '');
    } else {
      customResponse.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      customResponse.response = 'Internal Server Error';
    }

    response.status(customResponse.statusCode).json(customResponse);

    this.logger.error(customResponse.response, AllExceptionsFilter.name);
    super.catch(exception, host);
  }
}
