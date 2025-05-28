import Record from '../data-classes/Record';
import '../css/table.css';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { deleteRecord, editRecord, fetchExecution } from '../data-service';
import toast from 'react-hot-toast';
import Execution from '../data-classes/Execution';

type RecordsTableProps = {
  records: Array<Record>;
  activeRecordIds: Array<number>;
  setActiveRecordIds: Dispatch<SetStateAction<number[]>>;
  itemsPerPage: number;
  searchLabel: string;
  searchUrl: string;
  searchTags: string[];
  setEditingRecord: Dispatch<SetStateAction<Record | null>>;
  reloadData(): void;
};

export default function RecordsTable({
  records,
  activeRecordIds,
  setActiveRecordIds,
  itemsPerPage,
  searchLabel,
  searchUrl,
  searchTags,
  setEditingRecord,
  reloadData,
}: RecordsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [executions, setExecutions] = useState<{ [key: string]: Execution }>({});

  const durationRefreshIntervalMs = 1000;

  const filteredRecords = records.filter(
    (record) =>
      record.label.includes(searchLabel) &&
      record.url.includes(searchUrl) &&
      (record.tags
        .map<string>((tag) => tag.name)
        .some((tag) => {
          return searchTags.includes(tag);
        }) ||
        searchTags.length === 0)
  );
  const currentItems = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = calcPageCount(itemsPerPage, filteredRecords.length);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  // sets intervals for fetching the executions of the unfinished executions
  useEffect(() => {
    const intervals: { [key: string]: number } = {};
    records.forEach((record) => {
      addExecution(record);
      if (record.lastExecution?.status === 'STARTED') {
        intervals[record.id] = window.setInterval(() => {
          if (record.lastExecution?.status !== 'STARTED') {
            clearInterval(intervals[record.id]);
          } else {
            addExecution(record);
          }
        }, durationRefreshIntervalMs);
      }
    });
    return () => {
      Object.values(intervals).forEach(clearInterval);
    };
  }, [records]);

  async function addExecution(record: Record) {
    let execution: Execution | undefined = record.lastExecution;
    if (record.lastExecution && !record.lastExecution.endTime) {
      execution = await fetchExecution(record.lastExecution.id);
    }

    setExecutions((prev) => {
      if (record.lastExecution) {
        return {
          ...prev,
          [record.id]: execution,
        };
      }
      return prev;
    });
  }
  function calcPageCount(itemsPerPage: number, itemsCount: number): number {
    if (itemsCount % itemsPerPage === 0) return itemsCount / itemsPerPage;
    return Math.floor(itemsCount / itemsPerPage) + 1;
  }

  function changeActiveRecord(recordId: number) {
    if (inActiveSelection(recordId)) {
      setActiveRecordIds((prev) => prev.filter((recordIdItem) => recordIdItem !== recordId));
    } else {
      setActiveRecordIds((prev) => [...prev, recordId]);
    }
    reloadData();
  }

  async function deleteRecordFromTable(recordId: number) {
    try {
      const deletePromise = deleteRecord(recordId);
      toast.promise(deletePromise, {
        loading: 'Loading...',
        success: 'Record deleted!',
      });
      await deletePromise;
      reloadData();
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete a record');
    }
  }

  function inActiveSelection(recordId: number) {
    return activeRecordIds.includes(recordId);
  }
  function durationMs(start: Date, end?: Date): number {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    const time = endDate.getTime() - startDate.getTime();
    return time;
  }
  function formatDuration(durationMs: number): string {
    if (durationMs < 0) return '0m 0s';
    const minutes = Math.floor(durationMs / (1000 * 60));
    const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s`;
  }

  async function toggleActiveStatus(record: Record) {
    const editedRecord = { ...record, active: !record.active };
    try {
      const editPromise = editRecord(editedRecord);
      toast.promise(editPromise, {
        loading: 'Loading...',
        success: "Record's active status changed!",
      });
      await editPromise;
    } catch (error) {
      console.log(error);
      toast.error('Failed to change the active status');
    }
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Label</th>
            <th>Tags</th>
            <th>Periodicity</th>
            <th>Execution time</th>
            <th>Last execution</th>
            <th>Status</th>
            <th>View in graph</th>
            <th>Active</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((record: Record) => (
            <tr key={record.id}>
              <td>{record.label}</td>
              <td>
                {record.tags.map((tag) => (
                  <span key={tag.id} className="tag">
                    {tag.name}
                  </span>
                ))}
              </td>
              <td>
                {record.periodicity.day}d {record.periodicity.hour}h {record.periodicity.minute}m
              </td>
              <td>
                {executions[record.id] &&
                  formatDuration(
                    durationMs(executions[record.id].startTime, executions[record.id].endTime)
                  )}
              </td>
              <td>
                {executions[record.id] &&
                  executions[record.id].startTime.toLocaleString('cs-CZ', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
              </td>
              <td>{executions[record.id] && executions[record.id].status}</td>
              <td>
                <input
                  type="checkbox"
                  name=""
                  id={'active-select-' + record.id}
                  checked={inActiveSelection(record.id)}
                  onChange={() => changeActiveRecord(record.id)}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={record.active}
                  onChange={() => toggleActiveStatus(record)}
                />
              </td>
              <td>
                <button onClick={() => setEditingRecord(record)}>Edit</button>
              </td>
              <td>
                <button onClick={() => deleteRecordFromTable(record.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {totalPages !== 0 && (
          <span id="curr-page">
            Page {currentPage} out of {totalPages}
          </span>
        )}
        {totalPages === 0 && <span>No records found</span>}
        <br />
        {currentPage !== 1 && (
          <button
            id="prev-btn"
            onClick={() => {
              if (currentPage > totalPages) {
                setCurrentPage(1);
              } else {
                setCurrentPage(currentPage - 1);
              }
            }}
          >
            Previous
          </button>
        )}
        {currentPage < totalPages && (
          <button
            id="next-btn"
            onClick={() => {
              if (currentPage > totalPages) {
                setCurrentPage(1);
              } else {
                setCurrentPage(currentPage + 1);
              }
            }}
          >
            Next
          </button>
        )}
        <br />
      </div>
    </>
  );
}
