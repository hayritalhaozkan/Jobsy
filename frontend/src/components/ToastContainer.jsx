import { useEffect, useState } from "react";

function ToastItem({ toast, onClose }) {
  const [progress, setProgress] = useState(100);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const enterTimer = setTimeout(() => {
      setVisible(true);
    }, 20);

    const startedAt = Date.now();
    const duration = toast.duration;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const nextProgress = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(nextProgress);
    }, 30);

    const exitTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose(toast.id), 260);
    }, duration);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearInterval(interval);
    };
  }, [toast, onClose]);

  const tone = tones[toast.type] || tones.info;
  const icon = icons[toast.type] || icons.info;

  return (
    <div
      style={{
        ...styles.toast,
        ...tone.card,
        transform: visible ? "translateX(0)" : "translateX(120%)",
        opacity: visible ? 1 : 0,
      }}
    >
      <div style={styles.topRow}>
        <div style={styles.iconWrap}>
          <span
            className="material-symbols-rounded"
            style={{ ...styles.icon, ...tone.icon }}
          >
            {icon}
          </span>
        </div>

        <div style={styles.content}>
          <div style={styles.title}>{toast.title}</div>
          {toast.message ? <div style={styles.message}>{toast.message}</div> : null}
        </div>

        <button style={styles.closeButton} onClick={() => onClose(toast.id)}>
          <span className="material-symbols-rounded" style={styles.closeIcon}>
            close
          </span>
        </button>
      </div>

      <div style={styles.progressTrack}>
        <div
          style={{
            ...styles.progressBar,
            ...tone.bar,
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}

function ToastContainer({ toasts, onClose }) {
  return (
    <div style={styles.container}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}

const tones = {
  success: {
    card: {
      border: "1px solid rgba(16,185,129,0.18)",
      background: "rgba(255,255,255,0.9)",
    },
    icon: {
      color: "#059669",
    },
    bar: {
      background: "linear-gradient(90deg, #10b981, #34d399)",
    },
  },
  error: {
    card: {
      border: "1px solid rgba(239,68,68,0.18)",
      background: "rgba(255,255,255,0.9)",
    },
    icon: {
      color: "#dc2626",
    },
    bar: {
      background: "linear-gradient(90deg, #ef4444, #fb7185)",
    },
  },
  warning: {
    card: {
      border: "1px solid rgba(245,158,11,0.18)",
      background: "rgba(255,255,255,0.9)",
    },
    icon: {
      color: "#d97706",
    },
    bar: {
      background: "linear-gradient(90deg, #f59e0b, #fbbf24)",
    },
  },
  info: {
    card: {
      border: "1px solid rgba(79,70,229,0.18)",
      background: "rgba(255,255,255,0.9)",
    },
    icon: {
      color: "#4f46e5",
    },
    bar: {
      background: "linear-gradient(90deg, #4f46e5, #0ea5e9)",
    },
  },
};

const icons = {
  success: "check_circle",
  error: "error",
  warning: "warning",
  info: "info",
};

const styles = {
  container: {
    position: "fixed",
    top: "104px",
    right: "20px",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    width: "min(380px, calc(100vw - 24px))",
  },

  toast: {
    borderRadius: "20px",
    padding: "14px 14px 12px",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    overflow: "hidden",
    transition:
      "transform 0.26s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.22s ease",
    willChange: "transform, opacity",
  },

  topRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
  },

  iconWrap: {
    width: "36px",
    height: "36px",
    borderRadius: "12px",
    background: "rgba(248,250,252,0.9)",
    border: "1px solid rgba(226,232,240,0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  icon: {
    fontSize: "20px",
  },

  content: {
    flex: 1,
    minWidth: 0,
  },

  title: {
    fontSize: "15px",
    fontWeight: 800,
    color: "#0f172a",
    lineHeight: 1.3,
    marginBottom: "4px",
  },

  message: {
    fontSize: "14px",
    lineHeight: 1.55,
    color: "#475569",
  },

  closeButton: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: "2px",
    color: "#64748b",
    flexShrink: 0,
  },

  closeIcon: {
    fontSize: "20px",
  },

  progressTrack: {
    marginTop: "12px",
    width: "100%",
    height: "4px",
    background: "rgba(226,232,240,0.8)",
    borderRadius: "999px",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    borderRadius: "999px",
    transition: "width 30ms linear",
  },
};

export default ToastContainer;