import asyncHandler from 'express-async-handler';
import MegaList from '../models/megalistModel.js';

export const addMegaList = asyncHandler(async (req, res) => {

    const { name, type, size, link } = req.body;

    const item = await MegaList.findOne({ link });

    if (item) {
        res.status(200);
        const data = await MegaList.find({});
        return res.send({ status: "alreadysuccess", data: data, message: "Link already exist" });
    }

    if (name && type && size && link) {
        await MegaList.create({
            name,
            type,
            size,
            link,
            popularity: "1"
        });
        MegaList.find({}, (err, result) => {
            if (err) {
                return console.log(err)
            } else {
                res.status(200);
                return res.send({ status: "addsuccess", message: "Added successfully", data: result });
            }
        });
    }
});

export const getMegaList = asyncHandler(async (req, res) => {

    const recentData = await MegaList.find().sort({updatedAt: -1});
    if (recentData && recentData.length > 0) {
        return res.send({ data: recentData, status: "success", message: "Fetched successfully" });
    } else {
        return res.send({ data: [], status: "failed", message: "No data to match" });
    }
});


export const deleteMegaFile = asyncHandler(async (req, res) => {
    const { id } = req.body;
    console.log(id, "XXX")
    try {
        await MegaList.findByIdAndDelete(id);
        const data = await MegaList.find({});
        res.status(200);
        return res.json({ data: data, status: "success", message: 'Deleted successfully' });
    } catch (err) {
        console.log(err); // Or any other way you want to handle the error
        res.status(500);
        return res.json({ status: "failed", message: 'An error occurred while deleting' });
    }
});

export const editMegaFile = asyncHandler(async (req, res) => {

    const { id, name, popularity } = req.body;

    try {
        await MegaList.findOneAndUpdate({ _id: id }, { name: name, popularity: popularity });
        const data = await MegaList.find({});
        res.status(200);
        return res.send({ data: data, status: "success", message: "Updated file name" })
    } catch (err) {
        console.log(err)
        res.status(500);
        return res.send({ status: "failed", message: "An error occurred while updating file name" })
    }

});

export const searchMegaFiles = asyncHandler(async (req, res) => {
    const { search, subname } = req.body;
    console.log(search, subname)
    if (search === "name") {
        const filterData = await MegaList.find({ name: { $regex: subname, $options: 'i' } });
        if (filterData[0]) return res.send({ data: filterData, status: "success", message: "Filtered successfully" })
    }

    return res.send({ data: [], status: "failed", message: "No data to match" })
});

// searchVolume,
// searchRecent,
// searchPopularity,
// searchAlphabeta,

export const searchVolume = asyncHandler(async (req, res) => {
    const data = await MegaList.find({});

    const filterData = data.map(doc => ({
        ...doc._doc,
        size: parseInt(doc.size, 10)
    })).sort((a, b) => a.size - b.size);

    if (filterData[0]) return res.send({ data: filterData, status: "success", message: "Filtered successfully" })

    return res.send({ data: [], status: "failed", message: "No data to match" })
});

export const searchRecent = asyncHandler(async (req, res) => {
    const recentData = await MegaList.find().sort({updatedAt: -1});
    if (recentData && recentData.length > 0) {
        return res.send({ data: recentData, status: "success", message: "Fetched successfully" });
    } else {
        return res.send({ data: [], status: "failed", message: "No data to match" });
    }
});

export const searchPopularity = asyncHandler(async (req, res) => {
    const filterData = await MegaList.find().sort({popularity: -1}); // -1 for descending order

    if (filterData.length > 0) { // changed to length property for checking array
        return res.send({ data: filterData, status: "success", message: "Filtered successfully" });
    }

    return res.send({ data: [], status: "failed", message: "No data to match" });
});

export const searchAlphabeta = asyncHandler(async (req, res) => {
    const filterData = await MegaList.find().sort({ name: 1 }); // 1 for ascending order, -1 for descending order
    if (filterData[0]) {
        return res.send({ data: filterData, status: "success", message: "Filtered successfully" });
    }

    return res.send({ data: [], status: "failed", message: "No data to match" });
});
