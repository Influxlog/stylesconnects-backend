import { Migration } from '@mikro-orm/migrations';

export class Migration20250101000001 extends Migration {

  async up(): Promise<void> {
    // Create token_config table
    this.addSql('create table if not exists "token_config" ("id" text not null, "config_type" text not null, "min_amount" numeric null, "max_amount" numeric null, "token_reward" integer not null, "token_value" numeric null, "is_enabled" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "token_config_pkey" primary key ("id"));');
    
    // Add unique constraint on config_type
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_token_config_config_type" ON "token_config" (config_type) WHERE deleted_at IS NULL;');
    
    // Add index on deleted_at for soft deletes
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_token_config_deleted_at" ON "token_config" (deleted_at) WHERE deleted_at IS NULL;');
    
    // Add check constraint for config_type enum
      this.addSql('ALTER TABLE "token_config" ADD CONSTRAINT "CHK_token_config_config_type" CHECK (config_type IN (\'purchase_reward_tier_1\', \'purchase_reward_tier_2\', \'token_value\'));');
      
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "token_config" cascade;');
  }

}