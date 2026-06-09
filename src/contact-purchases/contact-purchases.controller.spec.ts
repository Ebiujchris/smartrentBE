import { Test, TestingModule } from '@nestjs/testing';
import { ContactPurchasesController } from './contact-purchases.controller';

describe('ContactPurchasesController', () => {
  let controller: ContactPurchasesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactPurchasesController],
    }).compile();

    controller = module.get<ContactPurchasesController>(ContactPurchasesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
