import { Migration } from '@mikro-orm/migrations';

export class Migration20250101000000 extends Migration {

  async up(): Promise<void> {
    // Create styled_token table
    this.addSql('create table if not exists "styled_token" ("id" text not null, "customer_id" text not null, "balance" numeric not null default 0, "total_earned" numeric not null default 0, "total_spent" numeric not null default 0, "status" text not null default \'active\', "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "styled_token_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_styled_token_customer_id" ON "styled_token" (customer_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_styled_token_deleted_at" ON "styled_token" (deleted_at) WHERE deleted_at IS NULL;');
    
    // Create token_transaction table
    this.addSql('create table if not exists "token_transaction" ("id" text not null, "customer_id" text not null, "type" text not null, "activity_type" text not null, "amount" numeric not null, "reference_id" text null, "reference_type" text null, "description" text not null, "expires_at" timestamptz null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "token_transaction_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_token_transaction_customer_id" ON "token_transaction" (customer_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_token_transaction_type" ON "token_transaction" (type) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_token_transaction_deleted_at" ON "token_transaction" (deleted_at) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "token_transaction" cascade;');
    this.addSql('drop table if exists "styled_token" cascade;');
  }

}