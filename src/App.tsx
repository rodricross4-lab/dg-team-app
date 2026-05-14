export default function App() {
  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#050505',color:'#fff',fontFamily:'Arial'}}>
      <aside style={{width:'260px',background:'#0b0b0b',borderRight:'1px solid #1f1f1f',padding:'24px'}}>
        <h1 style={{color:'#ff1a1a',fontSize:'32px',marginBottom:'40px'}}>DG TEAM</h1>
        <nav style={{display:'flex',flexDirection:'column',gap:'18px'}}>
          <button style={btn}>Dashboard</button>
          <button style={btn}>Alunos</button>
          <button style={btn}>Biblioteca</button>
          <button style={btn}>Configurações</button>
        </nav>
      </aside>

      <main style={{flex:1,padding:'32px'}}>
        <h2 style={{fontSize:'42px',marginBottom:'12px'}}>Dashboard DG TEAM</h2>
        <p style={{color:'#999',marginBottom:'32px'}}>Sistema premium de gestão fitness.</p>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'20px'}}>
          <Card title='Total de alunos' value='128'/>
          <Card title='Treinos hoje' value='24'/>
          <Card title='Frequência semanal' value='76%'/>
          <Card title='Volume Load' value='125.430kg'/>
        </div>
      </main>
    </div>
  )
}

function Card({title,value}:{title:string,value:string}){
  return (
    <div style={{background:'#101010',padding:'24px',borderRadius:'18px',border:'1px solid #1f1f1f',boxShadow:'0 0 20px rgba(255,0,0,0.12)'}}>
      <p style={{color:'#999',marginBottom:'12px'}}>{title}</p>
      <h3 style={{fontSize:'32px',color:'#ff2a2a'}}>{value}</h3>
    </div>
  )
}

const btn={
  background:'#111',
  color:'#fff',
  border:'1px solid #222',
  padding:'14px 18px',
  borderRadius:'12px',
  cursor:'pointer',
  textAlign:'left' as const
};