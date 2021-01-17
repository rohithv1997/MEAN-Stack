import { IPostGetResponse } from './IPost.GetResponse';

export interface IGetResponse {
  message: string;
  posts: IPostGetResponse[];
}
