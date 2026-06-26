import { apiClient } from "@/lib/apiClient";
import { profileResponseType, profileType } from "./types";

export  async function getProfile()
{
     const res= await apiClient.get<profileResponseType<profileType>>('api/profile')
      return  res.data.mockProfile
}