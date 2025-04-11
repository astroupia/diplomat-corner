import { connectToDatabase } from "@/lib/db-connect";
import House from "@/lib/models/house.model";

export async function getHouseById(id: string) {
  try {
    await connectToDatabase();
    const house = await House.findById(id);
    return house;
  } catch (error) {
    console.error("Error fetching house:", error);
    throw error;
  }
} 