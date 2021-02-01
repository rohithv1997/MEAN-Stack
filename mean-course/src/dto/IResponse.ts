import { IDefaultResponse } from './IDefaultResponse';
import { IPostDto } from './IPost.dto';

export interface IResponse extends IDefaultResponse {
  posts: IPostDto[];
}
