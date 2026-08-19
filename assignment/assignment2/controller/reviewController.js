const { createReview,getReviews } = require("../service/reviewSvc");

const createRev = async (req, res) => {
  try {
    const data = req.body;
    const review = await createReview(data);
    res.status(201).json({ message: "review created successfully!!", review });
  } catch (err) {
    console.log(err);
    if (err.message == "Duplicate review")
      return res.status(400).json({ message: "Duplicate review" });
    res.status(500).json({ message: "internal server error" });
  }
};

const getRev = async (req, res) => {
    try{
        const { page = 1, limit = 2 } = req.query;
        const reviews=await getReviews(page,limit);
        res.json({message:"reviews fetched suucessfully!!",reviews})
    }
    catch(err){
        console.log(err);
        if(err.message=="no review found")
            return res.status(400).json({ message: "no review found" }); 
        res.status(500).json({ message: "internal server error" });
    }
};

module.exports = { createRev, getRev};
