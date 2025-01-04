import { BadRequestException, Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')@UseInterceptors(FileInterceptor('file'))
  async uploadProductImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({maxSize: 1024 * 1024 * 10}),
          new FileTypeValidator({ fileType: /^(image\/png|image\/jpeg|image\/jpg|image\/gif)$/ })
        ]
      })
    )
    file: Express.Multer.File
  ): Promise<{url: string}> {
    try {
      const fileUrl = await this.filesService.uploadFile(file, 'products');
    return { url: fileUrl };
    } catch (error) {
      console.error(error); // Registra el error para obtener más detalles
      throw new BadRequestException(`Error uploading file: ${error.message}`);
    }
  }
  
}
