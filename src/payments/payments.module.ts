import { Module } from '@nestjs/common';
import { ShopsModule } from 'src/shops/shops.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { BanksModule } from '../bank/banks.module';

@Module({
  imports: [ShopsModule, BanksModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
