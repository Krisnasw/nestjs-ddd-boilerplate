import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtUtilService {
  constructor(private readonly jwtService: JwtService) {}

  extractPayloadFromToken(token: string): any {
    try {
      const decodedToken = this.jwtService.decode(token);
      if (decodedToken && typeof decodedToken === 'object') {
        return decodedToken;
      }
    } catch (error) {
      throw new Error('Failed to extract');
    }
    return null;
  }
}
