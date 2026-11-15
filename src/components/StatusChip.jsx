import { statusTone } from "../utils/missions";
import "./StatusChip.css";

/**
 * Small status label with a coloured dot. Renders nothing when the label is
 * missing, so callers do not need to guard optional data.
 */
export default function StatusChip({ label, tone }) {
  if (!label) return null;

  return (
    <span className="status-chip" data-tone={tone ?? statusTone(label)}>
      <span className="status-chip__dot" aria-hidden="true" />
      {label}
    </span>
  );
}
