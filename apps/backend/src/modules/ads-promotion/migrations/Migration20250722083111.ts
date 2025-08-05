import { Migration } from '@mikro-orm/migrations';


export class Migration20250722083111 extends Migration {
  override async up(): Promise<void> {
    this
      .addSql(`create table if not exists "seller_seller_adspromotionmodule_ads_promotion" (
      "seller_id" text not null,
      "ads_promotion_id" text not null,
      "created_at" timestamptz not null default now(),
      "updated_at" timestamptz not null default now(),
      "deleted_at" timestamptz null,
      constraint "seller_seller_adspromotionmodule_ads_promotion_pkey" primary key ("seller_id", "ads_promotion_id")
    );`)

    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_seller_seller_adspromotionmodule_ads_promotion_seller_id" ON "seller_seller_adspromotionmodule_ads_promotion" ("seller_id") WHERE deleted_at IS NULL;`
    )

    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_seller_seller_adspromotionmodule_ads_promotion_ads_promotion_id" ON "seller_seller_adspromotionmodule_ads_promotion" ("ads_promotion_id") WHERE deleted_at IS NULL;`
    )

    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_seller_seller_adspromotionmodule_ads_promotion_deleted_at" ON "seller_seller_adspromotionmodule_ads_promotion" ("deleted_at") WHERE deleted_at IS NULL;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `drop table if exists "seller_seller_adspromotionmodule_ads_promotion" cascade;`
    )
  }
}