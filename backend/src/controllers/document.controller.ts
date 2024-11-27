import { RequestWithUser } from '@/interfaces/auth.interface';
import { validationMiddleware } from '@middlewares/validation.middleware';
import ApiService from '@services/api.service';
import authMiddleware from '@middlewares/auth.middleware';
import { IsString } from 'class-validator';
import { Body, Controller, Get, Param, Post, Req, Res, UploadedFile, UploadedFiles, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { formatOrgNr, OrgNumberFormat } from '@/utils/util';
import { logger } from '@/utils/logger';
import { Employee, LoginName, PortalPersonData } from '@/interfaces/employee.interface';

import { validateRequestBody } from '@/utils/validate';
import { fileUploadOptions } from '@/utils/fileUploadOptions';
import { DocumentCreateRequest } from '@/data-contracts/document/data-contracts';
import { CreateDocument, SearchDocument, DocumentType } from '@/responses/document.response';
@Controller()
export class DocumentController {
  private apiService = new ApiService();

  @Post('/document/upload')
  @OpenAPI({ summary: 'Upload document' })
  @UseBefore(authMiddleware)
  async uploadDocument(
    @Req() req: RequestWithUser,
    @UploadedFile('documentFiles', { options: fileUploadOptions, required: false }) files: Express.Multer.File[],
    @Body() document: DocumentCreateRequest,
  ): Promise<{ data: {}; message: string }> {
    await validateRequestBody(CreateDocument, document);

    const url = 'document/3.0/2281/documents';
    const documentFiles = files[0].buffer.toString('base64');
    const response = await this.apiService.post<any>({ url, data: { document, documentFiles } }, req.user).catch(e => {
      logger.error('document post error:', e);
      throw e;
    });
    return { data: response.data, message: `document uploaded on employment` };
  }

  @Post('/document/search')
  @OpenAPI({ summary: 'Fetch documents on employment' })
  @UseBefore(authMiddleware)
  async getDocuments(@Req() req: RequestWithUser, @Body() documentData: SearchDocument): Promise<{ data: SearchDocument; message: string }> {
    await validateRequestBody(SearchDocument, documentData);

    const url = 'document/3.0/2281/documents/filter';
    const response = await this.apiService.post<any>({ url, data: documentData }, req.user).catch(e => {
      logger.error('document post error:', e);
      throw e;
    });
    return { data: response.data, message: `searched documents` };
  }

  @Get('/document/types')
  @OpenAPI({ summary: 'Fetch document types' })
  @UseBefore(authMiddleware)
  async documentTypes(@Req() req: RequestWithUser, @Res() response: DocumentType): Promise<{ data: DocumentType; message: string }> {
    const url = `document/3.0/2281/admin/documenttypes`;
    const res = await this.apiService.get<DocumentType>({ url }, req.user).catch(e => {
      logger.error('Error when fetching document types');
      throw e;
    });
    return { data: res.data, message: 'success' };
  }
}
