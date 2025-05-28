import '../css/ToggleSwitch.css';

type ToggleSwitchProps = {
  switchLabel: string;
  labelOn: string;
  labelOff: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

export const ToggleSwitch = ({
  switchLabel,
  labelOn,
  labelOff,
  checked,
  onChange,
}: ToggleSwitchProps) => {
  return (
    <label>
      {switchLabel}
      <div className={'switch-wrapper-' + switchLabel}>
        <span className={!checked ? 'label active' : 'label'}>{labelOff}</span>
        <label className="switch">
          <input
            id={switchLabel + '-switch'}
            type="checkbox"
            checked={checked}
            onChange={() => onChange(!checked)}
          />
          <span className="slider"></span>
        </label>
        <span className={checked ? 'label active' : 'label'}>{labelOn}</span>
      </div>
    </label>
  );
};
