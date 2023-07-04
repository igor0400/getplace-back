import { Controller, Get } from '@nestjs/common';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly PdfService: PdfService) {}

  @Get('test')
  test() {
    return this.PdfService.generateCheckFile();
  }
}
