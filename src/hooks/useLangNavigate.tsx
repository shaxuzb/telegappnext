import { useNavigate, useParams } from "react-router-dom";

export default function useLangNavigate() {
  const navigate = useNavigate();
  const { lang } = useParams();

  return (path: any, options = {}) => {
    const finalPath = path.startsWith("/")
      ? `/${lang}${path}`
      : `/${lang}/${path}`;
    navigate(finalPath, options);
  };
}
