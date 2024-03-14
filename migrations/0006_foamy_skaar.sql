CREATE TABLE IF NOT EXISTS "goal_contributions" (
	"id" serial PRIMARY KEY NOT NULL,
	"occured_at" timestamp NOT NULL,
	"taskId" integer NOT NULL,
	"goalId" integer NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goal_contributions" ADD CONSTRAINT "goal_contributions_taskId_task_id_fk" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goal_contributions" ADD CONSTRAINT "goal_contributions_goalId_goal_id_fk" FOREIGN KEY ("goalId") REFERENCES "goal"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goal_contributions" ADD CONSTRAINT "goal_contributions_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
