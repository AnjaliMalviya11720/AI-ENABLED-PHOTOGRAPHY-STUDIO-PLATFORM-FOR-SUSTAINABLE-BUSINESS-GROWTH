import { useState, useEffect } from "react";
import API from "../services/api";
import "./gallery.css";

export default function Gallery() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  
  // Edit State
  const [editingPhoto, setEditingPhoto] = useState<any>(null);

  const [formData, setFormData] = useState<{title: string, category: string, imageFile: File | null}>({
    title: "",
    category: "Wedding",
    imageFile: null
  });

  const fetchPhotos = async () => {
    try {
      const res = await API.get("/photos");
      setPhotos(res.data.data || res.data);
    } catch (error) {
      console.error("Failed to load photos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageFile) return alert("Please select an image");
    
    setUploading(true);
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("category", formData.category);
      payload.append("image", formData.imageFile);

      await API.post("/photos", payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Photo uploaded successfully! 📸");
      setFormData({ title: "", category: "Wedding", imageFile: null });
      setShowUpload(false);
      fetchPhotos();
    } catch (error: any) {
      alert(error.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;
    try {
      await API.delete(`/photos/${id}`);
      fetchPhotos();
    } catch (error: any) {
      alert("Failed to delete photo");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.put(`/photos/${editingPhoto._id || editingPhoto.id}`, {
        title: editingPhoto.title,
        category: editingPhoto.category
      });
      alert("Updated successfully!");
      setEditingPhoto(null);
      fetchPhotos();
    } catch (error: any) {
      alert("Update failed");
    }
  };

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h1>My Photo Gallery</h1>
        <button className="upload-btn" onClick={() => setShowUpload(!showUpload)}>
          {showUpload ? "Cancel Upload" : "+ Upload Photo"}
        </button>
      </div>

      {showUpload && (
        <div className="upload-form glass-panel">
          <h3>Upload New Photo</h3>
          <form onSubmit={handleUpload}>
            <div className="input-row">
              <div className="input-group">
                <label>Title</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="input-group">
                <label>Category</label>
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  <option>Wedding</option>
                  <option>Portrait</option>
                  <option>Product</option>
                  <option>Event</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div className="input-group">
              <label>Image File 📸</label>
              <input type="file" accept="image/*" onChange={(e) => setFormData({...formData, imageFile: e.target.files ? e.target.files[0] : null})} required />
            </div>
            <button type="submit" disabled={uploading} className="primary-btn">
              {uploading ? "Uploading..." : "Publish Photo"}
            </button>
          </form>
        </div>
      )}

      {/* Edit Modal (Inline for simplicity) */}
      {editingPhoto && (
        <div className="upload-form glass-panel" style={{ border: "2px solid rgba(95,111,255,0.55)" }}>
          <h3>Edit Photo Info</h3>
          <form onSubmit={handleUpdate}>
            <div className="input-row">
              <div className="input-group">
                <label>Title</label>
                <input type="text" value={editingPhoto.title} onChange={(e) => setEditingPhoto({...editingPhoto, title: e.target.value})} required />
              </div>
              <div className="input-group">
                <label>Category</label>
                <select value={editingPhoto.category} onChange={(e) => setEditingPhoto({...editingPhoto, category: e.target.value})}>
                  <option>Wedding</option><option>Portrait</option><option>Product</option><option>Event</option><option>Other</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" className="primary-btn">Save Changes</button>
              <button type="button" className="action-btn" onClick={() => setEditingPhoto(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="gallery-loading">Loading photos...</div>
      ) : photos.length === 0 ? (
        <div className="empty-state">No photos found. Upload your first photo to get started!</div>
      ) : (
        <div className="photo-grid">
          {photos.map((photo: any) => (
            <div key={photo._id || photo.id} className="photo-card" style={{ position: "relative" }}>
              <img src={photo.imageUrl} alt={photo.title} />
              <div className="photo-info">
                <h4>{photo.title}</h4>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="photo-category">{photo.category}</span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button style={{ background: "transparent", border: "1px solid #5f6fff", color: "#5f6fff", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }} onClick={() => setEditingPhoto(photo)}>Edit</button>
                    <button style={{ background: "rgba(220, 38, 38, 0.1)", border: "1px solid rgba(220, 38, 38, 0.3)", color: "#a33030", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }} onClick={() => handleDelete(photo._id || photo.id)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
