import { z } from "zod";

// --- Create Note Schema ---
declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      email: string;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  content: z.string().min(1, "Content is required"),
});
export type CreateNoteInput = z.infer<typeof createNoteSchema>;

// --- Delete Note Schema ---
export const deleteNoteSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid note ID"), // Mongoose ObjectId
});
export type DeleteNoteInput = z.infer<typeof deleteNoteSchema>;
