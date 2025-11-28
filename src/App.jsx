import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./routes/AppRouter";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html, body, #root { height: 100%; }
  /* apply Poppins broadly so components and form controls inherit it */
  html, body, #root, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video,
  input, button, textarea, select, option, svg {
    font-family: 'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial !important;
  }

  body {
    margin: 0;
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