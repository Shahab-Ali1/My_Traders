import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  import { join } from 'path';
  
  @Catch(HttpException)
  export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const request = ctx.getRequest<Request>();
      const response = ctx.getResponse<Response>();
  
      const status = exception.getStatus
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
      const exceptionResponse = exception.getResponse();
  
      // Extract message safely
      let message:any = 'An error occurred';
  
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse; // Direct string response
      } else if (exceptionResponse['errors']){
        message = exceptionResponse;
      }else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as { message?: string | string[] }; // Type assertion
        if (responseObj.message) {
          message = Array.isArray(responseObj.message)
            ? responseObj.message[0] // If an array, take the first message
            : responseObj.message;
        }
      }
  
      // Handle different request types
      const acceptHeader = request.headers['accept'];
  
      if (status === 404 && acceptHeader && acceptHeader.includes('text/html')) {
        // Serve the 404.html file for web requests
        const filePath = join(process.cwd(), 'public', '404.html');
        response.status(404).sendFile(filePath);
      } else {
        // Send plain text response for API requests
        response.status(status).send(message);
      }
    }
  }