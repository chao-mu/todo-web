// Ours - Styles
import styles from "./page.module.css";

import { ScheduleGrid } from "@/components/ScheduleGrid";
import { ScheduleFormPopupButton } from "@/components/ScheduleForm";

// Ours - API
import { api, isAPIError } from "@/server/api";

export default async function Page() {
  const schedulesRes = await api.schedules.all({});
  if (isAPIError(schedulesRes)) {
    throw new Error(schedulesRes.error);
  }

  const schedules = schedulesRes.data;
  const schedule = schedules[0];

  return (
    <div className={styles["page"]}>
      <div className={styles["action-row"]}>
        <ScheduleFormPopupButton>New Schedule</ScheduleFormPopupButton>
        <ScheduleFormPopupButton schedule={schedule}>
          Edit Schedule
        </ScheduleFormPopupButton>
      </div>
      {schedule && (
        <ScheduleGrid title={schedule.title} content={schedule.content} />
      )}
    </div>
  );
}
