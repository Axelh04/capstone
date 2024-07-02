-- CreateTable
CREATE TABLE "Recordings" (
    "id" SERIAL NOT NULL,
    "audios" BYTEA NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Recordings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Recordings" ADD CONSTRAINT "Recordings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
