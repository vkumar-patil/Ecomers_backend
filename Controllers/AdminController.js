const insertData = require("../Model/AdminModel");
exports.RowData = async (req, res) => {
  try {
    const { title, price, description, image } = req.body;
    const data = new insertData({ title, price, description, image });
    await data.save();
    return res.status(201).send({ message: "data submit done" });
  } catch (error) {
    res.status(404).send({ message: "data not submited" });
  }
};

exports.getData = async (req, res) => {
  try {
    const getData = await insertData();
    return res.status(200).send({ message: "data get done ", data: getData });
  } catch (error) {
    res.status(400).send({ message: "data not found" });
  }
};
