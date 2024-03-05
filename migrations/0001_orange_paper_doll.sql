CREATE TABLE IF NOT EXISTS "goal" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	CONSTRAINT "goal_userId_name_unique" UNIQUE("userId","name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "task_goal" (
	"taskId" integer NOT NULL,
	"goalId" integer NOT NULL,
	CONSTRAINT "task_goal_taskId_goalId_pk" PRIMARY KEY("taskId","goalId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goal" ADD CONSTRAINT "goal_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task_goal" ADD CONSTRAINT "task_goal_taskId_task_id_fk" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task_goal" ADD CONSTRAINT "task_goal_goalId_goal_id_fk" FOREIGN KEY ("goalId") REFERENCES "goal"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
