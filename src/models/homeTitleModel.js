import mongoose from 'mongoose';

const HomeListSchema = mongoose.Schema(
  {
    firstTitleOne: {
      type: String,
      default: "Your Hub for Entertainment and Artistry"
    },
    secondTitleOne: {
      type: String,
      default: "Sound Waves Await - Dive into Our Audio Spectrum"
    },
    thirdTitleOne: {
      type: String,
      default: "Visual Delight - Browse Through Our Rich Video Tapestry"
    },
    firstTitleTwo: {
      type: String,
      default: "Your Gateway to a World of Music and Video"
    },
    secondTitleTwo: {
      type: String,
      default: "Journey with Us - The Making of Our Digital Media Empire"
    },
    thirdTitleTwo: {
      type: String,
      default: "Discover Our Story and the Passion behind Our Media Platform"
    },
    forthTitle: {
      type: String,
      default: "Immerse yourself in new media releases"
    },
    totalAssets: {
      type: String,
      default: "Total Assets"
    },
    totalDownloads: {
      type: String,
      default: "Total Downloads"
    },
    todayViews: {
      type: String,
      default: "Today Views"
    },
    todayDownloads: {
      type: String,
      default: "Today Downloads"
    },
    totalAssetsNumber: {
      type: String,
      default: "13K+"
    },
    totalDownloadsNumber: {
      type: String,
      default: "34K+"
    },
    todayViewsNumber: {
      type: String,
      default: "2K+"
    },
    todayDownloadsNumber: {
      type: String,
      default: "1K+"
    },

  },
  {
    timestamps: true,
  }
);

const HomeList = mongoose.model('HomeList', HomeListSchema, 'hometitlelists');

export default HomeList;
