import { Migration } from '@mikro-orm/migrations';

export class Migration20250516075430 extends Migration {
  override async up(): Promise<void> {
    // Check if column exists before adding it
    const columnExists = await this.execute(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='split_order_payment' AND column_name='seller_id'
    `);
    
    if (columnExists.length === 0) {
      this.addSql(`alter table "split_order_payment" add column "seller_id" text not null;`);
    }
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "split_order_payment" drop column if exists "seller_id";`);
  }
}