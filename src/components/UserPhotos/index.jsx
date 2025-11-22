import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

// 🔹 Tạo loader cho tất cả ảnh trong src/images (chỉ làm 1 lần ở module scope)
const imagesCtx = require.context("../../images", false, /\.(png|jpe?g|gif|webp|svg)$/);
const getImage = (fileName) => {
  try {
    // Webpack yêu cầu đường dẫn bắt đầu bằng "./"
    return imagesCtx(`./${fileName}`);
  } catch {
    return null; // nếu không có file, trả null để dễ debug
  }
};

function fmt(dt) {
  try {
    return new Date(dt).toLocaleString();
  } catch {
    return String(dt);
  }
}

export default function UserPhotos() {
  const { userId: paramUserId } = useParams();
  const { pathname } = useLocation();

  const rawId = paramUserId || (pathname || "").split("/")[2] || "";
  const maybeNum = Number(rawId);
  const userId = Number.isNaN(maybeNum) ? rawId : maybeNum;

  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch user data
    fetchModel(`/user/${userId}`)
      .then((userData) => {
        setUser(userData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        setUser(null);
        setLoading(false);
      });

    // Fetch photos
    fetchModel(`/photosOfUser/${userId}`)
      .then((photoData) => {
        setPhotos(photoData || []);
      })
      .catch((error) => {
        console.error("Error fetching photos:", error);
        setPhotos([]);
      });
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found.</div>;

  return (
    <div className="user-photos">
      <h2>Photos of {user.first_name} {user.last_name}</h2>

      {photos.length === 0 && <div>No photos.</div>}

      {photos.map((p) => {
        const imgSrc = getImage(p.file_name); 

        return (
          <div key={p._id} className="photo-card" style={{ marginBottom: 24 }}>
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={p.file_name}
                style={{ maxWidth: "100%", borderRadius: 8, display: "block" }}
              />
            ) : (
              <div style={{ color: "#b00" }}>
                Không tìm thấy ảnh
              </div>
            )}

            <div style={{ marginTop: 6, color: "#666" }}>
              Posted: {fmt(p.date_time)}
            </div>

            <div style={{ marginTop: 12 }}>
              <b>Comments:</b>
              {(!p.comments || p.comments.length === 0) && <div>No comments</div>}
              {p.comments?.map((c) => (
                <div key={c._id} style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
                  <div style={{ marginBottom: 4 }}>
                    <Link to={`/users/${c.user._id}`}>
                      {c.user.first_name} {c.user.last_name}
                    </Link>{" "}
                    • <span style={{ color: "#666" }}>{fmt(c.date_time)}</span>
                  </div>
                  <div>{c.comment}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}