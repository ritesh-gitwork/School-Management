import { z } from "zod";

export const addStudentSchema = z.object({
  classId: z.string(),
  studentId: z.string(),
});
