/**
 * A row of toggle buttons. `selected` is a list of option ids.
 * Used for single choice (pass one id) and multiple choice alike.
 */
export default function ChipGroup({ label, options, selected, onToggle, disabledIds = [] }) {
  return (
    <div className="chips" role="group" aria-label={label}>
      {options.map((option) => {
        const isOn = selected.includes(option.id);
        const isDisabled = !isOn && disabledIds.includes(option.id);
        return (
          <button
            key={option.id}
            type="button"
            className="chip"
            aria-pressed={isOn}
            aria-disabled={isDisabled || undefined}
            onClick={() => !isDisabled && onToggle(option.id)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
