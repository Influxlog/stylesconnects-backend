import { Migration } from '@mikro-orm/migrations';

export class Migration20250717163917 extends Migration {

  override async up(): Promise<void> {
    // In the up() method, replace the seller_id logic with:
    this.addSql(`alter table if exists "split_order_payment" add column if not exists "seller_id" text;`);
    // Delete records with null seller_id (use with caution!)
    this.addSql(`delete from "split_order_payment" where "seller_id" is null;`);
    this.addSql(`alter table if exists "split_order_payment" alter column "seller_id" set not null;`);
    this.addSql(`alter table if exists "split_order_payment" alter column "captured_amount" type numeric using ("captured_amount"::numeric);`);
    this.addSql(`alter table if exists "split_order_payment" alter column "captured_amount" set default 0;`);
    this.addSql(`alter table if exists "split_order_payment" alter column "refunded_amount" type numeric using ("refunded_amount"::numeric);`);
    this.addSql(`alter table if exists "split_order_payment" alter column "refunded_amount" set default 0;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "split_order_payment" drop column if exists "seller_id";`);

    this.addSql(`alter table if exists "split_order_payment" alter column "captured_amount" drop default;`);
    this.addSql(`alter table if exists "split_order_payment" alter column "captured_amount" type numeric using ("captured_amount"::numeric);`);
    this.addSql(`alter table if exists "split_order_payment" alter column "refunded_amount" drop default;`);
    this.addSql(`alter table if exists "split_order_payment" alter column "refunded_amount" type numeric using ("refunded_amount"::numeric);`);
  }

}
