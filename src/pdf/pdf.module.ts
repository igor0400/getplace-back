import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PDFModule as T00ndayPDFModule } from '@t00nday/nestjs-pdf';
import { PdfController } from './pdf.controller';

@Module({
  imports: [
    T00ndayPDFModule.register({
      isGlobal: true,
      view: {
        root: './templates',
        engine: 'pug',
      },
    }),
  ],
  providers: [PdfService],
  exports: [PdfService],
  controllers: [PdfController],
})
export class PdfModule {}
