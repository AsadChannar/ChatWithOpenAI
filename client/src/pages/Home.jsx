import { Card } from "react-bootstrap"
import { Link } from "react-router-dom"

function Home() {
  return (
    <div>
      <div className="d-flex gap-3 flex-sm-column flex-md-row justify-content-center my-5">
        <Link to="/chat">
          <Card className="p-3">
            <Card.Title>
              Chat with OPENAI
            </Card.Title>
            <Card.Text>
              Chating with ChatGPT3.5 turbo
            </Card.Text>
          </Card>
        </Link>
        <Link to="/file">
          <Card className="p-3">
            <Card.Title>
              Upload Files
            </Card.Title>
            <Card.Text>
              Upload files in LLM localsystum
            </Card.Text>
          </Card>
        </Link>
      </div>
    </div>
  )
}

export default Home
