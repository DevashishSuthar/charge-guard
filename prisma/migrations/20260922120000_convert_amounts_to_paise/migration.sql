-- Existing amounts were stored as whole rupees. Convert them to paise.
ALTER TABLE "recharge_items"
  ALTER COLUMN "amount" TYPE INTEGER
  USING "amount" * 100;
