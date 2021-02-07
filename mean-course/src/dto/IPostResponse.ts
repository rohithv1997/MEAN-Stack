import { IDefaultResponse } from './IDefaultResponse';
import { IPostDto } from './IPost.dto';

export interface IPostResponse extends IDefaultResponse {
  posts: IPostDto[];
}
