import { FormEvent, useState } from 'react';
import '../css/CreateDialog.css';
import Record from '../data-classes/Record';
import toast from 'react-hot-toast';

type RecordDialogProps = {
  id: string;
  buttonLabel?: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  editingRecord?: Record | null;
  emptyEditingRecord?: () => void;
};
export default function CreateRecordDialog({
  id,
  onSubmit,
  editingRecord,
  buttonLabel,
  emptyEditingRecord,
}: RecordDialogProps) {
  const [day, setDay] = useState(editingRecord?.periodicity.day ?? 0);
  const [hour, setHour] = useState(editingRecord?.periodicity.hour ?? 1);
  const [minute, setMinute] = useState(editingRecord?.periodicity.minute ?? 0);
  const [currentTag, setCurrentTag] = useState('');
  const [tags, setTags] = useState(editingRecord?.tags.map((tag) => tag.name) ?? []);

  const handleDayChange = (value: number) => {
    setDay(Number(value));
  };
  const handleHourChange = (value: number) => {
    setHour(Number(value));
  };
  const handleMinuteChange = (value: number) => {
    setMinute(Number(value));
  };
  const handleTagChange = (value: string) => {
    setCurrentTag(value);
  };
  const deleteTag = (event: React.MouseEvent<HTMLButtonElement>) => {
    const tagEl = event.currentTarget.parentNode!.firstChild!;
    const tagText = tagEl.textContent;
    setTags(tags.filter((tag) => tag !== tagText!));
    tagEl.parentNode!.removeChild(tagEl);
  };
  const addTag = () => {
    if (!(currentTag in tags) && currentTag.length !== 0) {
      setTags((prev) => [...prev, currentTag]);
    }
    setCurrentTag('');
  };
  function resetForm(event: FormEvent) {
    const form = event.currentTarget as HTMLFormElement;
    setDay(0);
    setHour(1);
    setMinute(0);
    setCurrentTag('');
    setTags([]);
    form.reset();
  }
  const toggleDialog = () => {
    const dialog = document.getElementById('dialog-' + id) as HTMLElement;
    const overlay = document.getElementById('dialog-overlay-' + id) as HTMLElement;
    dialog.hidden = !dialog.hidden;
    overlay.hidden = !overlay.hidden;
    if (emptyEditingRecord) {
      emptyEditingRecord();
    }
  };
  function validateFormData(formEvent: FormEvent): boolean {
    const formData = new FormData(formEvent.currentTarget as HTMLFormElement);

    const result =
      formData.has('label') &&
      formData.get('label')?.toString().length !== 0 &&
      formData.has('url') &&
      formData.get('url')?.toString().length !== 0 &&
      formData.has('boundaryRegExp') &&
      formData.get('boundaryRegExp')?.toString().length !== 0 &&
      formData.has('periodicity') &&
      formData.get('periodicity') !== '0:0:0';
    return result;
  }
  return (
    <>
      {buttonLabel && (
        <button onClick={toggleDialog} id={'toggle-dialog-' + id}>
          {buttonLabel}
        </button>
      )}
      <div
        className="dialog-overlay"
        id={'dialog-overlay-' + id}
        onClick={toggleDialog}
        hidden={editingRecord === undefined}
      />
      <div className="dialog" id={'dialog-' + id} hidden={editingRecord === undefined}>
        {!editingRecord && <h2>Create Record</h2>}
        {editingRecord && <h2>Edit Record {editingRecord.label}</h2>}
        <form
          id={'dialog-form-' + id}
          className="dialog"
          onSubmit={(e) => {
            e.preventDefault();
            if (!validateFormData(e)) {
              toast.error(`Please fill the label, url, boundary RegEx and periodicity`, {
                duration: 3250,
              });
              return;
            }
            onSubmit(e);
            resetForm(e);
            toggleDialog();
          }}
        >
          <label htmlFor={'label-' + id}>
            Label:
            <input
              type="text"
              name="label"
              id={'label-' + id}
              defaultValue={editingRecord?.label}
            />
          </label>
          <label htmlFor={'url-' + id}>
            URL:
            <input type="text" name="url" id={'url-' + id} defaultValue={editingRecord?.url} />
          </label>
          <label htmlFor={'boundaryRegExp-' + id}>
            Boundary RegEx:
            <input
              type="text"
              name="boundaryRegExp"
              id={'boundaryRegExp-' + id}
              defaultValue={editingRecord?.boundaryRegExp}
            />
          </label>
          <h3>Periodicity:</h3>
          <label htmlFor={'days-' + id}>
            Days:
            <input
              type="number"
              id={'days-' + id}
              onChange={(e) => handleDayChange(Number(e.currentTarget.value))}
              value={day}
              min={0}
            />
          </label>
          <label htmlFor={'hours-' + id}>
            Hours:
            <input
              type="number"
              id={'hours-' + id}
              onChange={(e) => handleHourChange(Number(e.currentTarget.value))}
              value={hour}
              min={0}
              max={23}
            />
          </label>
          <label htmlFor={'minutes-' + id}>
            Minutes:
            <input
              type="number"
              id={'minutes-' + id}
              onChange={(e) => handleMinuteChange(Number(e.currentTarget.value))}
              value={minute}
              min={0}
              max={59}
            />
          </label>
          <input
            type="text"
            name="periodicity"
            id={'periodicity' + id}
            value={day + ':' + hour + ':' + minute}
            hidden
            readOnly
          />

          <br />
          <input
            type="text"
            id={'tag-' + id}
            value={currentTag}
            onChange={(e) => handleTagChange(e.currentTarget.value)}
          />
          <button type="button" id={'addTag' + id} onClick={addTag}>
            Add tag
          </button>
          <div>
            {tags.map((tag) => (
              <li key={tag + id}>
                <span className="tag">{tag}</span>
                <button type="button" onClick={deleteTag}>
                  X
                </button>
              </li>
            ))}
          </div>
          <input type="hidden" name="tags" value={JSON.stringify(tags)} />
          <input type="hidden" name="active" value="true" />
          {editingRecord && <input type="hidden" name="id" value={editingRecord.id} />}
          <br />
          <button type="submit" value="Submit">
            Submit
          </button>
          <button type="button" onClick={toggleDialog}>
            Close
          </button>
        </form>
      </div>
    </>
  );
}
