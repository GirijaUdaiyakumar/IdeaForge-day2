const Idea = require("../models/Ideas");

const getIdeas = async (req, res) => {
  const ideas = await Idea.find({
    user: req.user,
  });

  res.json(ideas);
};

const createIdea = async (req, res) => {
  const { title, category, description } =
    req.body;

  const idea = await Idea.create({
    title,
    category,
    description,
    user: req.user,
  });

  res.status(201).json(idea);
};

const updateIdea = async (req, res) => {
  const idea = await Idea.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  res.json(idea);
};

const deleteIdea = async (req, res) => {
  await Idea.findByIdAndDelete(req.params.id);

  res.json({
    message: "Idea deleted",
  });
};

module.exports = {
  getIdeas,
  createIdea,
  updateIdea,
  deleteIdea,
};