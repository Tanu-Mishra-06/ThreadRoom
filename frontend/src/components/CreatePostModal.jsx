import { useState } from "react";

function CreatePostModal({ selectedTopic, onClose, onCreatePost }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return;

    try {
      setSubmitting(true);

      await onCreatePost({
        title: title.trim(),
        content: content.trim(),
        topic: selectedTopic.name,
        image,
      });

      setTitle("");
      setContent("");
      setImage(null);
      setPreview("");

      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="create-post-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-top">
          <div>
            <p className="modal-topic-label">{selectedTopic.name}</p>
            <h2>Create a new post</h2>
          </div>

          <button
            className="modal-close-btn"
            onClick={onClose}
            disabled={submitting}
          >
            ×
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <input
            type="text"
            className="modal-input"
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            className="modal-textarea"
            placeholder="What do you want to discuss?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <div className="image-upload-box">
            <label className="image-upload-label">
              Upload Image (optional)
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            {preview && (
              <div className="image-preview">
                <img src={preview} alt="Preview" />
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="post-action-btn"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="create-post-btn"
              disabled={submitting}
            >
              {submitting ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePostModal;