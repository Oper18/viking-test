-- upgrade --
ALTER TABLE "employee" ALTER COLUMN "chief_id" DROP NOT NULL;
-- downgrade --
ALTER TABLE "employee" ALTER COLUMN "chief_id" SET NOT NULL;
