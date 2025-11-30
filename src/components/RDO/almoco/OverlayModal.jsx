import React from "react";

export default function OverlayModal({ children }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.55)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 16
      }}
    >
      <div
        style={{
          background: "#0d1b2a",
          border: "1px solid #2a475e",
          borderRadius: 12,
          padding: 20,
          width: "100%",
          maxWidth: 380,
          color: "#e5f0ff"
        }}
      >
        {children}
      </div>
    </div>
  );
}
