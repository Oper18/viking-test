-- upgrade --
ALTER TABLE "employee" ALTER COLUMN "work_date_start" TYPE DATE USING "work_date_start"::DATE;
-- downgrade --
ALTER TABLE "employee" ALTER COLUMN "work_date_start" TYPE TIMESTAMPTZ USING "work_date_start"::TIMESTAMPTZ;
