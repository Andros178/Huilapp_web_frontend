import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./routes/AppRouter";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html, body, #root { height: 100%; }
  body {
    margin: 0;
    font-family: 'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #f7f7f7;
    color: #222;
  }
  * { box-sizing: border-box; }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </>
  );
}

export default App;