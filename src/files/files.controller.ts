import { BadRequestException, Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './static/uploads'
    })
  })
  )
  async uploadProductImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({maxSize: 1024 * 1024 * 10}),
          new FileTypeValidator({fileType: '.(png|jpeg|jpg|gif)'})
        ]
      })
    )
    file: Express.Multer.File
  ): Promise<string> {
    try {
      return await this.filesService.uploadFile(file, 'products');
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
