import { ConfigType } from "@/types/ConfigType.type";
import axios from "axios";

export async function GET() {
  try{
    const auth = `Bearer ${process.env.API_TOKEN}`;
    const data = await axios
      .get<ConfigType>("https://api.themoviedb.org/3/configuration", {
        headers: { Authorization: auth },
      })
      .then((res) => ({
          secure_base_url: res.data.images.secure_base_url,
          base_url: res.data.images.base_url,
      }))
  
    return Response.json(data);
  } catch(err){
    console.error("Error fetching config:", err)
    return new Response("Error fetching config", { status: 500 });
  }
}
