import { useEffect, useState } from "react";
import api from "./api";

export default function useGenres() {
  const [genres, setGenres] = useState([]);
  useEffect(() => {
    api.get("/genres/").then((res) => setGenres(res.data)).catch(() => {});
  }, []);
  return genres;
}