import { Test, TestingModule } from '@nestjs/testing';
import { ContactPurchasesService } from './contact-purchases.service';

describe('ContactPurchasesService', () => {
  let service: ContactPurchasesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactPurchasesService],
    }).compile();

    service = module.get<ContactPurchasesService>(ContactPurchasesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
