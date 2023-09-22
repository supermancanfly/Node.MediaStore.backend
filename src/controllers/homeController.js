import asyncHandler from 'express-async-handler';
import HomeList from '../models/homeTitleModel.js';


export const getHomeTitles = asyncHandler(async (req, res) => {

    const data = await HomeList.find({});
    if (!data[0]) {
        await HomeList.create({
            firstTitleOne: "Your Hub for Entertainment and Artistry",
            secondTitleOne: "Sound Waves Await - Dive into Our Audio Spectrum",
            thirdTitleOne: "Visual Delight - Browse Through Our Rich Video Tapestry",
            firstTitleTwo: "Your Gateway to a World of Music and Video",
            secondTitleTwo: "Journey with Us - The Making of Our Digital Media Empire",
            thirdTitleTwo: "Discover Our Story and the Passion behind Our Media Platform",
            forthTitle: "Immerse yourself in our Extensive Media Library for all 360 days",
            totalAssets: "Total Assets",
            totalDownloads: "Total Downloads",
            todayViews: "Today Views",
            todayDownloads: "Today Downloads",
            totalAssetsNumber: "13K+",
            totalDownloadsNumber: "34K+",
            todayViewsNumber: "2K+",
            todayDownloadsNumber: "1K+",
        });
    }

    HomeList.find({}, (err, result) => {
        if (err) {
            return console.log(err)
        } else {
            return res.send({ status: "success", message: "Got successfully", data: result[0] });
        }
    });
});

export const updateHomeTitles = asyncHandler(async (req, res) => {

    const { 
        firstTitleOne,
        secondTitleOne,
        thirdTitleOne,
        firstTitleTwo,
        secondTitleTwo,
        thirdTitleTwo,
        forthTitle,
        totalAssets,
        totalDownloads,
        todayViews,
        todayDownloads,
        totalAssetsNumber,
        totalDownloadsNumber,
        todayViewsNumber,
        todayDownloadsNumber, 
    } = req.body;

    try {
        const total = await HomeList.find({});
        await HomeList.findOneAndUpdate({ _id: total[0]._id }, {
            firstTitleOne,
            secondTitleOne,
            thirdTitleOne,
            firstTitleTwo,
            secondTitleTwo,
            thirdTitleTwo,
            forthTitle,
            totalAssets,
            totalDownloads,
            todayViews,
            todayDownloads,
            totalAssetsNumber,
            totalDownloadsNumber,
            todayViewsNumber,
            todayDownloadsNumber, 
        });
        const data = await HomeList.find({});
        res.status(200);
        return res.send({ data: data[0], status: "success", message: "Updated home details" })
    } catch (err) {
        console.log(err)
        res.status(500);
        return res.send({ status: "failed", message: "An error occurred while updating file name" })
    }

});
