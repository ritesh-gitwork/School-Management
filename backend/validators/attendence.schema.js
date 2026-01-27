import { z } from "zod";

export const attendanceSchema = z.object({
  classId: z.string(),
  studentId: z.string(),
  status: z.enum(["present", "absent"]),
});
