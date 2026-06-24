import React from 'react';

export default function IdeaCard({ idea, onEdit, onDelete }) {
  return (
    <div className="idea-card" onMouseEnter={() => {}}>
      <div className="idea-card-header">
        <h3>{idea.title}</h3>
        <span className="idea-category">{idea.category}</span>
      </div>
      <p className="idea-problem">{idea.problem}</p>
      <p className="idea-description">{idea.description}</p>
      <div className="idea-actions">
        <button className="button button-small" onClick={() => onEdit(idea._id)}>Edit</button>
        <button className="button button-small button-danger" onClick={() => onDelete(idea._id)}>Delete</button>
      </div>
    </div>
  );
}
