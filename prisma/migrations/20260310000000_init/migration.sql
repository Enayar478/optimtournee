-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "RecurrenceType" AS ENUM ('weekly', 'biweekly', 'monthly', 'bimonthly', 'quarterly');

-- CreateEnum
CREATE TYPE "InterventionType" AS ENUM ('mowing', 'hedge_trimming', 'pruning', 'weeding', 'planting', 'maintenance', 'emergency');

-- CreateEnum
CREATE TYPE "InterventionStatus" AS ENUM ('planned', 'in_progress', 'completed', 'cancelled', 'postponed');

-- CreateEnum
CREATE TYPE "EquipmentType" AS ENUM ('lawn_tractor', 'push_mower', 'hedge_trimmer', 'chainsaw', 'blower', 'trailer', 'utility_vehicle');

-- CreateEnum
CREATE TYPE "OneOffStatus" AS ENUM ('pending', 'scheduled', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('recurring', 'oneoff');

-- CreateEnum
CREATE TYPE "WeatherCondition" AS ENUM ('clear', 'cloudy', 'rain', 'storm', 'snow');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#2D5A3D',
    "defaultStartAddress" TEXT,
    "defaultStartLat" DOUBLE PRECISION,
    "defaultStartLng" DOUBLE PRECISION,
    "workScheduleStart" TEXT NOT NULL DEFAULT '08:00',
    "workScheduleEnd" TEXT NOT NULL DEFAULT '17:00',
    "lunchBreakMinutes" INTEGER NOT NULL DEFAULT 60,
    "workingDays" INTEGER[],
    "unavailableDates" TIMESTAMP(3)[],
    "skills" "InterventionType"[],
    "assignedEquipment" "EquipmentType"[],

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "licenseTypes" TEXT[],

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "type" "EquipmentType" NOT NULL,
    "name" TEXT NOT NULL,
    "requiresTrailer" BOOLEAN NOT NULL DEFAULT false,
    "maintenanceDates" TIMESTAMP(3)[],

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecurringContract" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "recurrence" "RecurrenceType" NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "interventionType" "InterventionType" NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "requiredEquipment" "EquipmentType"[],
    "priority" INTEGER NOT NULL DEFAULT 1,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "notes" TEXT,
    "maxWindSpeed" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "noRainForecast" BOOLEAN NOT NULL DEFAULT false,
    "minTemperature" DOUBLE PRECISION NOT NULL DEFAULT -5,
    "maxTemperature" DOUBLE PRECISION NOT NULL DEFAULT 40,

    CONSTRAINT "RecurringContract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OneOffRequest" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "requestDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "preferredDateStart" TIMESTAMP(3),
    "preferredDateEnd" TIMESTAMP(3),
    "interventionType" "InterventionType" NOT NULL,
    "description" TEXT NOT NULL,
    "durationEstimate" INTEGER NOT NULL,
    "requiredEquipment" "EquipmentType"[],
    "priority" INTEGER NOT NULL DEFAULT 1,
    "status" "OneOffStatus" NOT NULL DEFAULT 'pending',
    "maxWindSpeed" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "noRainForecast" BOOLEAN NOT NULL DEFAULT false,
    "minTemperature" DOUBLE PRECISION NOT NULL DEFAULT -5,
    "maxTemperature" DOUBLE PRECISION NOT NULL DEFAULT 40,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OneOffRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlannedIntervention" (
    "id" TEXT NOT NULL,
    "sourceType" "SourceType" NOT NULL,
    "sourceContractId" TEXT,
    "sourceRequestId" TEXT,
    "clientId" TEXT NOT NULL,
    "interventionType" "InterventionType" NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "estimatedStartTime" TEXT NOT NULL,
    "estimatedDurationMinutes" INTEGER NOT NULL,
    "assignedTeamId" TEXT NOT NULL,
    "assignedEquipment" "EquipmentType"[],
    "status" "InterventionStatus" NOT NULL DEFAULT 'planned',
    "routeOrder" INTEGER NOT NULL DEFAULT 0,
    "estimatedTravelTimeMinutes" INTEGER NOT NULL DEFAULT 0,
    "estimatedTravelDistanceKm" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "weatherDate" TIMESTAMP(3),
    "weatherTemperature" DOUBLE PRECISION,
    "weatherWindSpeed" DOUBLE PRECISION,
    "weatherRainProbability" DOUBLE PRECISION,
    "weatherRainMm" DOUBLE PRECISION,
    "weatherCondition" "WeatherCondition",
    "weatherIsSuitable" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlannedIntervention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1,
    "totalInterventions" INTEGER NOT NULL DEFAULT 0,
    "totalDistanceKm" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalDrivingTimeHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "clientsServed" INTEGER NOT NULL DEFAULT 0,
    "teamsUtilized" INTEGER NOT NULL DEFAULT 0,
    "estimatedTimeSavedHours" DOUBLE PRECISION,
    "estimatedFuelSavedLiters" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RecurringContract_clientId_key" ON "RecurringContract"("clientId");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringContract" ADD CONSTRAINT "RecurringContract_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
