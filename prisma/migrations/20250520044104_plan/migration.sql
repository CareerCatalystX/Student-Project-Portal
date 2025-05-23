-- CreateTable
CREATE TABLE "_CollegeToPlan" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CollegeToPlan_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CollegeToPlan_B_index" ON "_CollegeToPlan"("B");

-- AddForeignKey
ALTER TABLE "_CollegeToPlan" ADD CONSTRAINT "_CollegeToPlan_A_fkey" FOREIGN KEY ("A") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollegeToPlan" ADD CONSTRAINT "_CollegeToPlan_B_fkey" FOREIGN KEY ("B") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
