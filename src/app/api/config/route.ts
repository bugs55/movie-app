import axios from "axios";

export async function GET() {
  const auth = `Bearer ${process.env.API_TOKEN}`;
  const data = await axios
    .get("https://api.themoviedb.org/3/configuration", {
      headers: { Authorization: auth },
    })
    .then((res) => res.data);

  return Response.json({ data });
}
