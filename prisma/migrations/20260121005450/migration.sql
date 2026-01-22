/*
  Warnings:

  - You are about to drop the column `calenderEventId` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `isFormCalender` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `processes` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `ragprocessed` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `transcriptReddy` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `teanName` on the `SlackInstallation` table. All the data in the column will be lost.
  - You are about to drop the column `SlackConnected` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `SlackTeamId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `calenderConnected` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `googleRefresshToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `preferredchannelName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `projectIId` on the `UserIntegration` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[calendarEventId]` on the table `Meeting` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `teamName` to the `SlackInstallation` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Meeting_calenderEventId_key";

-- AlterTable
ALTER TABLE "Meeting" DROP COLUMN "calenderEventId",
DROP COLUMN "isFormCalender",
DROP COLUMN "processes",
DROP COLUMN "ragprocessed",
DROP COLUMN "transcriptReddy",
ADD COLUMN     "calendarEventId" TEXT,
ADD COLUMN     "isFromCalendar" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "processed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ragProcessed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "transcriptReady" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "SlackInstallation" DROP COLUMN "teanName",
ADD COLUMN     "teamName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "SlackConnected",
DROP COLUMN "SlackTeamId",
DROP COLUMN "calenderConnected",
DROP COLUMN "googleRefresshToken",
DROP COLUMN "preferredchannelName",
ADD COLUMN     "billingPeriodStart" TIMESTAMP(3),
ADD COLUMN     "calendarConnected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "chatMessagesToday" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "currentPlan" TEXT NOT NULL DEFAULT 'free',
ADD COLUMN     "googleRefreshToken" TEXT,
ADD COLUMN     "meetingsThisMonth" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "preferredChannelName" TEXT,
ADD COLUMN     "slackConnected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "slackTeamId" TEXT,
ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "stripeSubscriptionId" TEXT,
ADD COLUMN     "subscriptionStatus" TEXT NOT NULL DEFAULT 'inactive',
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "botName" SET DEFAULT 'Meeting Bot';

-- AlterTable
ALTER TABLE "UserIntegration" DROP COLUMN "projectIId",
ADD COLUMN     "projectId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Meeting_calendarEventId_key" ON "Meeting"("calendarEventId");
