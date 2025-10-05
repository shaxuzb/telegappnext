import ReactQueryProvider from "./ReactQueryProvider";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import "swiper/css";
const App = () => {
  return (
      <ReactQueryProvider>
        <RouterProvider router={router} />
      </ReactQueryProvider>
  );
};

export default App;
