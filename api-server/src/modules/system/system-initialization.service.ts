import { Injectable, Logger } from '@nestjs/common';

import { CheckSystemInitializationUseCase } from '@ca/application';

@Injectable()
export class SystemInitializationService {
  private readonly logger = new Logger(SystemInitializationService.name);

  constructor(
    private readonly checkSystemInitializationUseCase: CheckSystemInitializationUseCase,
  ) {}

  async checkSystemInitialization(): Promise<void> {
    this.logger.log('Checking system initialization...');

    const result = await this.checkSystemInitializationUseCase.execute();

    if (!result.checkPass) {
      this.logger.error('System initialization check failed');
      result.missingMessages.forEach((message) => {
        this.logger.error(`- ${message}`);
      });
    }

    this.logger.log('System initialization check passed');
  }
}
