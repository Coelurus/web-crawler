import Record from './Record'
import '../css/table.css'
export default function RecordsTable({records}: {records:Array<Record>}){
    return(
        <>
            <table>
                <thead>
                    <tr>
                        <th>Label</th>
                        <th>Tags</th>
                        <th>Periodicity</th>
                        <th>Time of execution</th>
                        <th>Last execution</th>
                        <th>View in graph</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {records && records.map((record:Record) =>(
                        <tr>
                            <td>{record.label}</td>
                            <td>{record.tags}</td>
                            <td>{record.periodicity}</td>
                            <td></td>
                            <td></td>
                            <td><input type="checkbox" name="" id="" /></td>
                            <td><button>Edit</button></td>
                            <td><button>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}