import { useEffect, useCallback } from "react";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function ImageLightbox({
  images,
  activeIndex,
  onClose,
  onPrev,
  onNext,
}) {
  // Close on Escape, navigate with arrow keys
  const handleKey = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden"; // prevent background scroll
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  if (!images || images.length === 0) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.92)",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "fadeIn 0.2s ease",
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          background: "rgba(255,255,255,0.12)",
          border: "none",
          color: "#ffffff",
          width: "2.5rem",
          height: "2.5rem",
          borderRadius: "9999px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.25rem",
          zIndex: 1000,
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
        }
      >
        <FiX />
      </button>

      {/* Prev button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          style={{
            position: "absolute",
            left: "1rem",
            background: "rgba(255,255,255,0.12)",
            border: "none",
            color: "#ffffff",
            width: "3rem",
            height: "3rem",
            borderRadius: "9999px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            transition: "background 0.2s",
            zIndex: 1000,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
          }
        >
          <FiChevronLeft />
        </button>
      )}

      {/* Main Image */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "90vw",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <img
          src={images[activeIndex]}
          alt={`Photo ${activeIndex + 1}`}
          style={{
            maxWidth: "88vw",
            maxHeight: "80vh",
            objectFit: "contain",
            borderRadius: "0.75rem",
            boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
          }}
        />

        {/* Counter + thumbnail strip */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.6rem",
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem" }}>
            {activeIndex + 1} / {images.length}
          </span>

          {images.length > 1 && (
            <div
              style={{
                display: "flex",
                gap: "0.4rem",
                flexWrap: "wrap",
                justifyContent: "center",
                maxWidth: "80vw",
              }}
            >
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  onClick={(e) => {
                    e.stopPropagation(); /* parent onNext/onPrev via index */
                  }}
                  style={{
                    width: "3.5rem",
                    height: "2.5rem",
                    objectFit: "cover",
                    borderRadius: "0.4rem",
                    border:
                      i === activeIndex
                        ? "2px solid #059669"
                        : "2px solid transparent",
                    cursor: "pointer",
                    opacity: i === activeIndex ? 1 : 0.55,
                    transition: "opacity 0.2s, border-color 0.2s",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          style={{
            position: "absolute",
            right: "1rem",
            background: "rgba(255,255,255,0.12)",
            border: "none",
            color: "#ffffff",
            width: "3rem",
            height: "3rem",
            borderRadius: "9999px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            transition: "background 0.2s",
            zIndex: 1000,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
          }
        >
          <FiChevronRight />
        </button>
      )}
    </div>
  );
}
