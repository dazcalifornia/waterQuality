export default function Card(){
  const data = `
    function greet() {
      console.log("Hello, world!");
    }
    `
  return (
      <div className="container">
      <div className="feed">
        <div className="tweet">
          <div className="avatar">
            <img  src="https://cdn.discordapp.com/attachments/884526941984665600/1080746791894515782/IMG_1490.png" alt="profile"/>
          </div>
          <div className="content">
            <div className="name">Franx</div>
            <div className="username">@Alexis</div>
            <div className="text">
              <div className="code-box">
                <pre>
                  <code>
                    {data}
                  </code>
                </pre>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div> 
  )
}
