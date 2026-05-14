import { useEffect, useState } from "react";
import API from "../services/api";
import "./common.css";
import "./dashboard.css";
import "./profile.css";
import "./albums.css";

type Album = { _id: string; name: string; description?: string; createdAt?: string };
type Photo = { _id: string; title: string };

export default function AlbumManagement() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photoId, setPhotoId] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [moving, setMoving] = useState(false);
  const [loadError, setLoadError] = useState("");

  const load = async () => {
    setLoadError("");
    try {
      const [albumsRes, photosRes] = await Promise.all([
        API.get("/albums"),
        API.get("/photos"),
      ]);
      setAlbums(albumsRes.data.data || []);
      setPhotos(photosRes.data.data || []);
    } catch {
      setLoadError("Could not load albums or photos.");
      setAlbums([]);
      setPhotos([]);
    }
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const createAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await API.post("/albums", { name, description });
      setName("");
      setDescription("");
      await load();
    } catch {
      alert("Could not create album.");
    } finally {
      setCreating(false);
    }
  };

  const deleteAlbum = async (id: string) => {
    if (!window.confirm("Delete this album? Photos in it will be unassigned from the album.")) {
      return;
    }
    try {
      await API.delete(`/albums/${id}`);
      if (albumId === id) setAlbumId("");
      await load();
    } catch {
      alert("Could not delete album.");
    }
  };

  const movePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoId || !albumId) return;
    setMoving(true);
    try {
      await API.put("/albums/move-photo", { photoId, albumId });
      alert("Photo moved to album.");
      setPhotoId("");
      await load();
    } catch {
      alert("Could not move photo.");
    } finally {
      setMoving(false);
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading albums…</div>;
  }

  return (
    <div className="profile-page">
      <div className="glass-card albums-hero">
        <div className="albums-hero-inner">
          <h1>Albums</h1>
          <p>
            Group your work into collections — weddings, portraits, events — then assign
            uploads from your gallery to keep portfolios organized.
          </p>
        </div>
      </div>

      {loadError ? (
        <div className="error-message" style={{ marginBottom: 20 }}>
          {loadError}
        </div>
      ) : null}

      <form onSubmit={createAlbum}>
        <div className="glass-card profile-section">
          <h2>Create album</h2>
          <p className="profile-hint" style={{ marginBottom: 16, marginTop: -8 }}>
            Give each album a clear name so clients can browse by category.
          </p>
          <div className="albums-form-row two-cols">
            <div className="input-group">
              <label htmlFor="alb-name">Album name</label>
              <input
                id="alb-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Wedding 2026"
              />
            </div>
            <div className="input-group">
              <label htmlFor="alb-desc">Description (optional)</label>
              <input
                id="alb-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short note for this collection"
              />
            </div>
          </div>
          <div className="albums-section-actions">
            <button
              type="submit"
              className="primary-btn profile-save-btn"
              disabled={creating}
            >
              {creating ? "Creating…" : "Create album"}
            </button>
          </div>
        </div>
      </form>

      <div className="glass-card profile-section">
        <h2>Your albums</h2>
        {albums.length === 0 ? (
          <div className="albums-empty">
            No albums yet. Create one above to start organizing your photos.
          </div>
        ) : (
          <div className="albums-grid">
            {albums.map((album) => (
              <div key={album._id} className="album-card">
                <span className="album-card-meta">Collection</span>
                <h3 className="album-card-title">{album.name}</h3>
                <p className="album-card-desc">
                  {album.description?.trim() || "No description added."}
                </p>
                <div className="album-card-actions">
                  <button
                    type="button"
                    className="btn-danger-outline"
                    onClick={() => deleteAlbum(album._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={movePhoto}>
        <div className="glass-card profile-section">
          <h2>Assign photo to album</h2>
          <p className="profile-hint" style={{ marginBottom: 16, marginTop: -8 }}>
            Pick a photo from your gallery and a destination album. Photos can be moved
            between albums anytime.
          </p>
          <div className="albums-move-row">
            <div className="input-group">
              <label htmlFor="alb-photo">Photo</label>
              <select
                id="alb-photo"
                value={photoId}
                onChange={(e) => setPhotoId(e.target.value)}
                required
              >
                <option value="">Select a photo</option>
                {photos.map((photo) => (
                  <option key={photo._id} value={photo._id}>
                    {photo.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="alb-target">Album</label>
              <select
                id="alb-target"
                value={albumId}
                onChange={(e) => setAlbumId(e.target.value)}
                required
              >
                <option value="">Select an album</option>
                {albums.map((album) => (
                  <option key={album._id} value={album._id}>
                    {album.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="primary-btn profile-save-btn"
              disabled={moving || albums.length === 0 || photos.length === 0}
            >
              {moving ? "Moving…" : "Move to album"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
