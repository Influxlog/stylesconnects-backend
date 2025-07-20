import { Migration } from '@mikro-orm/migrations';

export class Migration20250717213126 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "seller" drop column if exists "paystack_subaccount_id", drop column if exists "paystack_recipient_id";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "seller" add column if not exists "paystack_subaccount_id" text null, add column if not exists "paystack_recipient_id" text null;`);
  }

}
