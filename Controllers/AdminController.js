const insertData = require("../Model/AdminModel");
exports.RowData = async (req, res) => {
  try {
    const { title, price, description } = req.body;
    const data = new insertData({
      title,
      price,
      description,
      Image: req.files?.map((file) => file.filename),
    });
    await data.save();
    return res.status(201).send({ message: "data submit done" });
  } catch (error) {
    res.status(404).send({ message: "data not submited" });
  }
};
exports.getData = async (req, res) => {
  try {
    const admindata = await insertData.find();
    const dataWithLinks = admindata.map((item) => ({
      ...item._doc,
      Image: `http://localhost:8000/uploads/${item.Image}`, // Ensure path is correct
    }));

    res.status(200).send({
      message: "data retrieval successful",
      success: true,
      data: dataWithLinks,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "data not found", success: false, error: error });
  }
};
// exports.getData = async (req, res) => {
//   try {
//     const getData = await insertData({});
//     console.log("Output from insertData:", getData);

//     let dataWithLink;

//     if (Array.isArray(getData)) {
//       // Process when getData is an array
//       dataWithLink = getData.map((item) => ({
//         ...item._doc, // Use _doc if it's a Mongoose document
//         Image:
//           Array.isArray(item.Image) && item.Image.length > 0
//             ? item.Image.map((img) => `http://localhost:8001/uploads/${img}`)
//             : [], // Return an empty array if no images
//       }));
//     } else if (typeof getData === "object" && getData !== null) {
//       // Normalize single object response into an array
//       dataWithLink = [
//         {
//           ...getData._doc, // Use _doc if it's a Mongoose document
//           Image:
//             Array.isArray(getData.Image) && getData.Image.length > 0
//               ? getData.Image.map(
//                   (img) => `http://localhost:8001/uploads/${img}`
//                 )
//               : [], // Return an empty array if no images
//         },
//       ];
//     } else {
//       // Handle unexpected data formats
//       console.error("insertData returned an invalid format:", getData);
//       return res
//         .status(500)
//         .send({ message: "Invalid data format", data: getData });
//     }

//     return res
//       .status(200)
//       .send({ message: "Data retrieved successfully", data: dataWithLink });
//   } catch (error) {
//     console.error("Error fetching data:", error.message);
//     res
//       .status(500)
//       .send({ message: "Error retrieving data", error: error.message });
//   }
// };
