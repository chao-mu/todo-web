import * as goals from "./goals";
import * as tasks from "./tasks";
import * as schedules from "./schedules";

export { type APIResponse, isAPIError } from "./shared";

export const api = {
  goals,
  tasks,
  schedules,
};
