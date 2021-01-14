import { IPostDto } from "./IPost.dto";

export interface IGetRequest{
  message: string;
  posts: IPostDto[];
}
