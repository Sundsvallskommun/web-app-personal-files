import { RequestWithUser } from '@/interfaces/auth.interface';
import { validationMiddleware } from '@middlewares/validation.middleware';
import ApiService from '@services/api.service';
import authMiddleware from '@middlewares/auth.middleware';
import { IsString } from 'class-validator';
import { Body, Controller, Get, Param, Post, Req, Res, UploadedFiles, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { formatOrgNr, OrgNumberFormat } from '@/utils/util';
import { logger } from '@/utils/logger';
import { Employee, LoginName, PortalPersonData } from '@/interfaces/employee.interface';
import { CreateDocument, SearchDocument } from '@/interfaces/document.interface';
import { validateRequestBody } from '@/utils/validate';
import { fileUploadOptions } from '@/utils/fileUploadOptions';
@Controller()
export class DocumentController {
  private apiService = new ApiService();

  @Post('/documents/upload')
  @OpenAPI({ summary: 'Upload document' })
  @UseBefore(authMiddleware)
  async uploadDocument(
    @Req() req: RequestWithUser,
    @UploadedFiles('files', { options: fileUploadOptions, required: false }) files: Express.Multer.File[],
    @Body() documentData: CreateDocument,
  ): Promise<{ data: {}; message: string }> {
    await validateRequestBody(CreateDocument, documentData);

    const url = 'documents/3.0/2281/documents';
    const data = {
      documentData,
      documentFiles: files[0].buffer.toString('base64'),
    };
    const response = await this.apiService.post<any>({ url, data }, req.user).catch(e => {
      logger.error('document post error:', e);
      throw e;
    });
    return { data: response.data, message: `document uploaded on employment` };
  }

  @Post('/documents/search')
  @OpenAPI({ summary: 'Fetch documents on employment' })
  @UseBefore(authMiddleware)
  async getDocuments(@Req() req: RequestWithUser, @Body() documentData: SearchDocument): Promise<{ data: SearchDocument; message: string }> {
    await validateRequestBody(SearchDocument, documentData);

    const url = 'documents/3.0/2281/documents';
    const response = await this.apiService.post<SearchDocument>({ url, data: documentData }, req.user).catch(e => {
      logger.error('document post error:', e);
      throw e;
    });
    return { data: response.data, message: `searched documents` };
  }
}
