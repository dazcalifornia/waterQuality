//import css 

export default function StatusCard(props: {status: string}){
  const status = props.status
  const statusColor = status === "Active" ? "green" : "red"

  return (
    <div className="status-pill">
      <p>{status}</p>
    </div>
  )
}
