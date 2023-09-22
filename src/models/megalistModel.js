import mongoose from 'mongoose';

const MegaListSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    size: {
        type: String,
        required: true
    },
    link: {
        type: String,
        unique: true,
        required: true
    },
    popularity: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

const MegaList = mongoose.model('MegaList', MegaListSchema, 'megalists');

export default MegaList;
