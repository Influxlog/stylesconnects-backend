import { Migration } from '@mikro-orm/migrations';

export class Migration20250721225916 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "ads_pricing" ("id" text not null, "type" text check ("type" in ('product', 'store')) not null, "duration_days" integer not null, "price_per_day" numeric not null, "currency_code" text not null default 'NGN', "is_active" boolean not null default true, "raw_price_per_day" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "ads_pricing_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_ads_pricing_deleted_at" ON "ads_pricing" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "ads_promotion" ("id" text not null, "seller_id" text not null, "type" text check ("type" in ('product', 'store')) not null default 'product', "target_id" text null, "title" text not null, "description" text null, "image_url" text null, "status" text check ("status" in ('draft', 'pending_payment', 'active', 'paused', 'expired', 'rejected')) not null default 'draft', "start_date" timestamptz null, "end_date" timestamptz null, "budget_amount" numeric not null, "spent_amount" numeric not null default 0, "currency_code" text not null default 'NGN', "payment_reference" text null, "payment_status" text check ("payment_status" in ('pending', 'paid', 'failed', 'refunded')) not null default 'pending', "admin_reviewer_id" text null, "admin_reviewer_note" text null, "admin_review_date" timestamptz null, "clicks" integer not null default 0, "impressions" integer not null default 0, "raw_budget_amount" jsonb not null, "raw_spent_amount" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "ads_promotion_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_ads_promotion_deleted_at" ON "ads_promotion" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "ads_pricing" cascade;`);

    this.addSql(`drop table if exists "ads_promotion" cascade;`);
  }

}
