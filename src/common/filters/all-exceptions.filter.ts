import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = ['Unexpected error'];
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      status = exception.getStatus();
      message = Array.isArray((res as any)?.message)
        ? (res as any).message
        : [(res as any)?.message || ''];
      error = (res as any)?.error || exception.name;
    }

    const { detail } = exception as any;
    if ((exception as any)?.code === '23505') {
      
      status = HttpStatus.BAD_REQUEST;
      message = [detail];
      error = 'Duplicate Record';
    }

    this.logger.error(
      `HTTP ${status} Error: ${JSON.stringify(message)}`,
    );

    response.status(status).json({
      message,
      error,
      statusCode: status,
    });
  }
}
