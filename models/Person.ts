import mongoose, { Schema, Document } from 'mongoose';

export interface IPerson extends Document {
  firstName: string;
  lastName: string;
  birthDate: string;
  deathDate?: string;
  isLiving: boolean;
  parents: mongoose.Types.ObjectId[];
  children: mongoose.Types.ObjectId[];
  spouse?: mongoose.Types.ObjectId;
}

const PersonSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthDate: { type: String, required: true },
  deathDate: { type: String },
  isLiving: { type: Boolean, default: true },
  parents: [{ type: Schema.Types.ObjectId, ref: 'Person' }],
  children: [{ type: Schema.Types.ObjectId, ref: 'Person' }],
  spouse: { type: Schema.Types.ObjectId, ref: 'Person' },
}, {
  timestamps: true
});

export default mongoose.models.Person || mongoose.model<IPerson>('Person', PersonSchema);
