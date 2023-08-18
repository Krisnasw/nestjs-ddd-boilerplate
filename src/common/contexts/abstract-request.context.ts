import { RequestContext } from '@medibloc/nestjs-request-context';

export class AbstractRequestContext extends RequestContext {
  headers: any;
  params: any;
  timezone: string;
  deviceVersion: string;
  devicePlatform: 'android' | 'ios';
  apiVersion: string;
  lang?: string;
  userId?: string;
}
