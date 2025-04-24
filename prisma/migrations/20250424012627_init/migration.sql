-- CreateTable
CREATE TABLE "WizardResult" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" TEXT NOT NULL,
    "criteria" TEXT NOT NULL,
    "recommendations" JSONB NOT NULL,
    "permalink" TEXT NOT NULL,

    CONSTRAINT "WizardResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermalinkIndex" (
    "permalink" TEXT NOT NULL,
    "resultId" TEXT NOT NULL,

    CONSTRAINT "PermalinkIndex_pkey" PRIMARY KEY ("permalink")
);

-- CreateIndex
CREATE UNIQUE INDEX "WizardResult_permalink_key" ON "WizardResult"("permalink");

-- CreateIndex
CREATE UNIQUE INDEX "PermalinkIndex_resultId_key" ON "PermalinkIndex"("resultId");

-- AddForeignKey
ALTER TABLE "PermalinkIndex" ADD CONSTRAINT "PermalinkIndex_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "WizardResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
