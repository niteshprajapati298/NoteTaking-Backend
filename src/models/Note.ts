import { Schema, model, Document, Types } from "mongoose";


export interface NoteDocument extends Document {
user: Types.ObjectId;
title:string
text: string;
}


const noteSchema = new Schema<NoteDocument>({
user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
title: { type: String, required: true },
text: { type: String, required: true },
}, { timestamps: true });


export const Note = model<NoteDocument>("Note", noteSchema);