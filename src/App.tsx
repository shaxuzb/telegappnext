import ReactQueryProvider from "./ReactQueryProvider";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import "swiper/css";
import { Root } from "./components/Root";
const App = () => {
  return (
    <Root>
      <ReactQueryProvider>
        <RouterProvider router={router} />
      </ReactQueryProvider>
    </Root>
  );
};

export default App;
