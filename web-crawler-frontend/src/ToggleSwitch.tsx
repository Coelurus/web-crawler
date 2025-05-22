import './css/ToggleSwitch.css'

type ToggleSwitchProps = {
    labelOn: string;
    labelOff: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

export const ToggleSwitch = ({ labelOn, labelOff, checked, onChange }: ToggleSwitchProps) => {
  return (
    <div className="switch-wrapper">
      <span className={!checked ? 'label active' : 'label'}>{labelOff}</span>
      <label className="switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onChange(!checked)}
        />
        <span className="slider"></span>
      </label>
      <span className={checked ? 'label active' : 'label'}>{labelOn}</span>
    </div>
  );
};