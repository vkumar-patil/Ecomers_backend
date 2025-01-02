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
      Image: `http://localhost:8001/uploads/${item.Image}`, // Ensure path is correct
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

exports.id = async (req, res) => {
  const { id } = req.params; // Extract `id` from request params

  // Validate the `id`
  if (!id || id.length !== 24) {
    return res.status(400).send({ message: "Invalid product ID format" });
  }

  try {
    const product = await insertData.findById(id); // Use `id` to fetch data

    if (!product) {
      return res
        .status(404)
        .send({ message: "Product not found with this ID" });
    }

    // Map Images to include full URL
    const dataWithLinks = {
      ...product._doc,
      Image: product.Image.map(
        (filename) => `http://localhost:8001/uploads/${filename}`
      ),
    };

    res.status(200).send(dataWithLinks);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send({ message: "Server error while fetching product" });
  }
};
