import { IPostDto } from './IPost.dto';

export interface IPostInfo {
  posts: IPostDto[];
  postCount: number;
}
