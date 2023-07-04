import { Injectable } from '@nestjs/common';
import {
  PDFOptions,
  PDFService as T00ndayPDFService,
} from '@t00nday/nestjs-pdf';

@Injectable()
export class PdfService {
  constructor(private readonly t00ndayPDFService: T00ndayPDFService) {}

  async generatePDFToFile(
    template: string,
    filename: string,
    options?: PDFOptions,
  ) {
    const file = await this.t00ndayPDFService.toFile(
      template,
      filename,
      options,
    );

    return file;
  }

  generateCheckFile() {}
}
