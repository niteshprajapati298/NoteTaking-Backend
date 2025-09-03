import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/auth";
import { Note } from "../models/Note";
import {
  createNoteSchema,
  deleteNoteSchema,
  CreateNoteInput,
  DeleteNoteInput,
} from "../validators/note";

const router = Router();


router.use(requireAuth);


router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id; 
    const notes = await Note.find({ user: userId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Failed to fetch notes" });
  }
});


router.post(
  "/createNote",
  async (req: Request<{}, {}, CreateNoteInput>, res: Response) => {
    try {
      const parseResult = createNoteSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ errors: parseResult.error.flatten() });
      }

      const { title, content } = parseResult.data;
      const userId = req.user!.id;
      console.log("create Route called",userId,title,content)

      const note = await Note.create({ user: userId, title:title, text:content });
      res.status(201).json(note);
    } catch (error) {
      console.error("Error creating note:", error);
      res.status(500).json({ message: "Failed to create note" });
    }
  }
);


router.delete(
  "/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const parseResult = deleteNoteSchema.safeParse({ id: req.params.id });
      if (!parseResult.success) {
        return res.status(400).json({ errors: parseResult.error.flatten() });
      }

      const userId = req.user!.id;
      const noteId = parseResult.data.id;

      const note = await Note.findOneAndDelete({ _id: noteId, user: userId });
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }

      res.json({ message: "Note deleted successfully" });
    } catch (error) {
      console.error("Error deleting note:", error);
      res.status(500).json({ message: "Failed to delete note" });
    }
  }
);

export default router;
