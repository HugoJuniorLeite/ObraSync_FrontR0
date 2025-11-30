import React from "react";
import { ImgThumb } from "../styles/layout";

const FotoUploader = ({ fotos, onAdd, onRemove }) => {
  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    const mapped = files.map((f) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(f),
      file: f,
    }));
    onAdd(mapped);
  };

  return (
    <div style={{ marginTop: 12 }}>
      <label
        style={{
          background: "#00396b",
          padding: "8px 10px",
          color: "white",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        Upload fotos
        <input
          type="file"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFiles}
        />
      </label>

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginTop: 10,
        }}
      >
        {fotos.map((f) => (
          <ImgThumb key={f.id}>
            <img src={f.url} alt="" />
            <button onClick={() => onRemove(f.id)}>×</button>
          </ImgThumb>
        ))}
      </div>
    </div>
  );
};

export default FotoUploader;

