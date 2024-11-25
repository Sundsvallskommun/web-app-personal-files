import App from '@/app';
import { IndexController } from '@controllers/index.controller';
import validateEnv from '@utils/validateEnv';
import { UserController } from './controllers/user.controller';
import { HealthController } from './controllers/health.controller';
import { EmployeeController } from './controllers/employee.controller';
import { DocumentController } from './controllers/document.controller';

validateEnv();

const app = new App([IndexController, UserController, HealthController, EmployeeController, DocumentController]);

app.listen();
