-- CreateTable
CREATE TABLE "OretokuSites" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "imageUrl" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OretokuSites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OretokuTags" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "imageUrl" VARCHAR(255) NOT NULL,
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OretokuTags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OretokuSitesToOretokuTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_OretokuSitesToOretokuTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "OretokuSites_url_key" ON "OretokuSites"("url");

-- CreateIndex
CREATE UNIQUE INDEX "OretokuTags_name_key" ON "OretokuTags"("name");

-- CreateIndex
CREATE INDEX "_OretokuSitesToOretokuTags_B_index" ON "_OretokuSitesToOretokuTags"("B");

-- AddForeignKey
ALTER TABLE "_OretokuSitesToOretokuTags" ADD CONSTRAINT "_OretokuSitesToOretokuTags_A_fkey" FOREIGN KEY ("A") REFERENCES "OretokuSites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OretokuSitesToOretokuTags" ADD CONSTRAINT "_OretokuSitesToOretokuTags_B_fkey" FOREIGN KEY ("B") REFERENCES "OretokuTags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
