import { useEffect, useState } from "react";

import {
  getIdeas,
  createIdea,
  deleteIdea,
} from "../services/ideaService";

function Ideas() {
  const [ideas, setIdeas] =
    useState([]);

  const [title, setTitle] =
    useState("");

  const loadIdeas = async () => {
    const res = await getIdeas();

    setIdeas(res.data);
  };

  useEffect(() => {
    loadIdeas();
  }, []);

  const addIdea = async () => {
    await createIdea({
      title,
      category: "General",
      description: "New Idea",
    });

    loadIdeas();
  };

  const removeIdea = async (id) => {
    await deleteIdea(id);

    loadIdeas();
  };

  return (
    <div>
      <h1>Ideas</h1>

      <input
        placeholder="Idea Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <button onClick={addIdea}>
        Add Idea
      </button>

      {ideas.map((idea) => (
        <div key={idea._id}>
          <h3>{idea.title}</h3>

          <button
            onClick={() =>
              removeIdea(idea._id)
            }
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Ideas;